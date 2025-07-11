// frontend/src/composables/useNotes.js
import { ref } from 'vue';
import axios from 'axios';
import { fetchNoteForVersionAndUser } from '../api'; // api.js에서 함수 임포트

// Simple debounce utility function
function debounce(func, delay) {
  let timeoutId;
  const debounced = function(...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };
  return debounced;
}

export default function useNotes(loggedInUserIdRef) { // loggedInUserId를 ref로 받음
  const notesContent = ref({}); // 각 버전별 노트 내용을 저장할 객체
  const isSaving = ref({}); // 저장 상태를 버전 ID별로 관리하는 객체로 초기화

  // 모든 버전에 대한 노트 내용을 불러오는 함수
  const loadVersionNotes = async (versionsToLoad) => {
    if (!loggedInUserIdRef.value) {
      console.warn('로그인되지 않은 사용자입니다. 노트를 불러올 수 없습니다.');
      return;
    }

    try {
      // 모든 버전에 대한 노트 정보를 병렬로 가져옵니다.
      const notePromises = versionsToLoad.map(version =>
        fetchNoteForVersionAndUser(version.id, loggedInUserIdRef.value)
      );
      const noteResults = await Promise.all(notePromises);

      // 가져온 노트 정보로 notesContent 객체를 만듭니다. 그 전에 notesContent를 초기화
      const newNotesContent = {};
      noteResults.forEach((result, index) => {
        const versionId = versionsToLoad[index].id;
        newNotesContent[versionId] = result.note ? result.note.content : '';
      });
      notesContent.value = newNotesContent; // 반응성을 위해 객체 자체를 교체
    } catch (error) {
      console.error('노트 불러오기 실패:', error);
    }
  };

  // 실제 백엔드에 노트를 저장하는 내부 함수
  const _performSave = async (versionId, content) => {
    if (!loggedInUserIdRef.value) {
      console.warn('로그인되지 않은 사용자입니다. 노트를 저장할 수 없습니다.');
      return;
    }
    // 반응형 객체를 직접 수정하여 특정 버전의 저장 상태를 true로 설정
    isSaving.value[versionId] = true;
    const startTime = Date.now();

    try {
      await axios.post('http://localhost:8001/api/notes', {
        version_id: versionId,
        owner_id: loggedInUserIdRef.value,
        content: content,
      });
      console.log(`Note for version ${versionId} saved successfully.`);
    } catch (error) {
      console.error(`Note for version ${versionId} save failed:`, error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 500 - elapsedTime; // 최소 500ms 유지

      const finishSaving = () => {
        // 저장이 완료되면 해당 버전 ID의 키를 객체에서 삭제
        delete isSaving.value[versionId];
      };

      if (remainingTime > 0) {
        setTimeout(finishSaving, remainingTime);
      } else {
        finishSaving();
      }
    }
  };

  // 디바운싱된 노트 저장 함수 (입력 중 사용)
  const debouncedSave = debounce(_performSave, 1000); // 1초 디바운스

  // 즉시 저장 함수 (블러 이벤트 등에서 사용)
  const saveImmediately = _performSave;

  return {
    notesContent,
    loadVersionNotes,
    debouncedSave, // 외부에는 디바운싱된 함수를 노출
    saveImmediately, // 즉시 저장 함수 노출
    isSaving, // 저장 상태 노출
  };
}