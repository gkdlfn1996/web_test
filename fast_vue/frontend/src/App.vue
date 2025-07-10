<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="d-flex align-center mb-4">
          <v-autocomplete
            v-model="projectName"
            label="Project"
            :items="projects"
            @update:modelValue="onProjectSelected"
            class="mr-4"
          ></v-autocomplete>
          <v-autocomplete
            v-model="selectedShotName"
            label="Shot"
            :items="shots.map(s => s.code)"
            :disabled="!shots.length"
            class="mr-4"
          ></v-autocomplete>
          <v-btn @click="loadVersions" :disabled="!selectedShotName">OK</v-btn>
          <v-btn @click="clear" class="ml-4">Clear</v-btn>
        </div>

        <!-- 버전 목록 테이블 -->
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
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchShots, fetchProjects, fetchVersionsForShot } from './api'
import axios from 'axios'; // axios 임포트 추가

export default {
  setup() {
    const projectName = ref('')
    const projects = ref([])
    const shots = ref([]) // 선택된 프로젝트의 샷 목록 (autocomplete items)
    const versions = ref([]) // 버전 목록을 저장할 ref 추가
    const selectedShotName = ref('') // 선택된 샷 이름

    // DB 테스트 관련 변수 추가
    const dbTestResult = ref(null);
    const dbTestError = ref(null);

  onMounted(
      async () => {
        const projData = await fetchProjects()
        projects.value = projData.projects || []
    })

    // 프로젝트 선택 시 해당 프로젝트의 샷 목록을 불러오는 함수
    async function onProjectSelected() {
      selectedShotName.value = ''; // 프로젝트 변경 시 샷 선택 초기화
      versions.value = []; // 프로젝트 변경 시 버전 목록 초기화
      if (projectName.value) {
        const data = await fetchShots(projectName.value);
        shots.value = data.shots || [];
      } else {
        shots.value = [];
      }
    }

    // 선택된 샷의 버전 목록을 불러오는 함수
    async function loadVersions() {
      const selectedShot = shots.value.find(s => s.code === selectedShotName.value);
      if (selectedShot) {
        const data = await fetchVersionsForShot(selectedShot.id);
        versions.value = data.versions || [];
      }
    }

    function clear() {
      projectName.value = ''
      shots.value = []
      versions.value = [] // 버전 목록도 초기화
      selectedShotName.value = '' // 선택된 샷 이름도 초기화
    }

    // DB 연결 테스트 메서드 추가
    async function testDbConnection() {
      dbTestResult.value = null;
      dbTestError.value = null;
      try {
        const response = await axios.get('http://localhost:8001/db-test');
        dbTestResult.value = response.data.message;
      } catch (error) {
        console.error('DB 연결 테스트 중 에러 발생:', error);
        dbTestError.value = error.message;
        if (error.response && error.response.data && error.response.data.message) {
          dbTestError.value = error.response.data.message;
        }
      }
    }

    // v-data-table을 위한 헤더 정의
    const versionHeaders = [
      { title: 'Version Name', key: 'code', sortable: false },
      { title: 'Note', key: 'note', sortable: false },
    ];

    return {
      projectName,
      projects,
      shots,
      selectedShotName, // 반환 객체에 추가
      versions, // 반환 객체에 추가
      onProjectSelected, // 반환 객체에 추가
      loadVersions, // 반환 객체에 추가
      clear,
      versionHeaders, // 반환 객체에 추가
      dbTestResult, // 반환 객체에 추가
      dbTestError,  // 반환 객체에 추가
      testDbConnection // 반환 객체에 추가
    }
  }
}
</script>

<style src="./assets/styles.css"></style>