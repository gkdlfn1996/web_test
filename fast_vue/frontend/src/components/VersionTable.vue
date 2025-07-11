<!-- frontend/src/components/VersionTable.vue -->
<template>
  <div class="versions-section" v-if="versions.length">
    <h2>Version</h2>
    <v-data-table
      :headers="versionHeaders"
      :items="versions"
      item-key="id"
      class="elevation-1"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.note="{ item }">
        <div class="note-section">
          <div class="my-note">
            <h3>My Draft Note ({{ item.code }})</h3>
            <v-textarea
              label="여기에 노트를 작성하세요"
              rows="3"
              v-model="localNotesContent[item.id]"
              @input="emit('input-note', item.id, localNotesContent[item.id])"
              @blur="emit('save-note', item.id, localNotesContent[item.id])"
              variant="outlined"
              :class="{ 'saving-note': !!isSaving[item.id] }"
            ></v-textarea>
          </div>
          <div class="other-notes">
            <h3>Others Draft Notes</h3>
            <p>다른 사람의 노트 내용이 여기에 실시간으로 표시됩니다.</p>
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  versions: Array,
  notes: Object, // notesContent 객체 (초기값 및 외부 업데이트용)
  notesComposable: Object, // notes composable 전체를 받음
  isSaving: Object, // isSaving prop 타입을 Object로 변경
});

const emit = defineEmits(['save-note', 'input-note']); // emit 이벤트 추가

const versionHeaders = [
  { title: 'Version', key: 'code', sortable: false },
  { title: 'Note', key: 'note', sortable: false },
];

// 로컬 노트 내용을 저장할 반응형 객체
const localNotesContent = ref({});

// props.notes가 변경될 때 localNotesContent를 초기화
watch(() => props.notes, (newNotes) => {
  localNotesContent.value = { ...newNotes };
}, { immediate: true, deep: true });






</script>

<style scoped>
/* v-textarea 컴포넌트에 saving-note 클래스가 있을 때, 내부의 v-field__field에 스타일 적용 */
::v-deep .v-textarea.saving-note .v-field__field {
  transition: background-color 0.5s ease-in-out; /* 트랜지션 시간 증가 */
  background-color: #E0F2F7; /* 연한 파란색 배경 */
}
/* 저장 완료 후 원래 색상으로 돌아오도록 CSS 트랜지션 추가 */
/* 필요한 스타일이 있다면 여기에 추가 */
</style>