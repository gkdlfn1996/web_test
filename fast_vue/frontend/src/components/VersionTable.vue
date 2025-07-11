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
              :model-value="notes[item.id]"
              @update:modelValue="updateNote(item.id, $event)"
              variant="outlined"
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


const props = defineProps({
  versions: Array,
  notes: Object, // notesContent 객체
});

const emit = defineEmits(['save-note']);

const versionHeaders = [
  { title: 'Version', key: 'code', sortable: false },
  { title: 'Note', key: 'note', sortable: false },
];

const updateNote = (versionId, content) => {
  emit('save-note', versionId, content);
};
</script>

<style scoped>
/* 필요한 스타일이 있다면 여기에 추가 */
</style>