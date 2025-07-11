// frontend/src/composables/useNotes.js
import { ref } from 'vue';
import axios from 'axios';
import { fetchNoteForVersionAndUser } from '../api'; // api.js에서 함수 임포트

export default function useNotes(loggedInUserIdRef) { // loggedInUserId를 ref로 받음
  const notesContent = ref({}); // 각 버전별 노트 내용을 저장할 객체

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

  // 노트 저장 메서드
  const saveNote = async (versionId, content) => {
    if (!loggedInUserIdRef.value) {
      console.warn('로그인되지 않은 사용자입니다. 노트를 저장할 수 없습니다.');
      return;
    }
    try {
      await axios.post('http://localhost:8001/api/notes', {
        version_id: versionId,
        owner_id: loggedInUserIdRef.value,
        content: content,
      });
      console.log(`Note for version ${versionId} saved successfully.`);
      return content; // 저장 성공 후 업데이트된 내용 반환
    } catch (error) {
      console.error(`Note for version ${versionId} save failed:`, error);
      return null; // 실패 시 null 반환
    }
  };

  return {
    notesContent,
    loadVersionNotes,
    saveNote,
  };
}