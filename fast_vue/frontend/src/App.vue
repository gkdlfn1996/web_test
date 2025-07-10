<template>
  <v-app>
    <v-main>
      <!-- 로그인 섹션 -->
      <v-container class="login-section">
        <v-card class="pa-5" elevation="2" v-if="!loggedInUser">
          <v-card-title class="text-h5">로그인</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="username"
              label="ShotGrid ID"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              @keyup.enter="login"
              required
            ></v-text-field>
            <v-alert
              v-if="loginError"
              type="error"
              dense
              text
              class="mb-3"
            >{{ loginError }}</v-alert>
            <v-btn color="primary" @click="login">로그인</v-btn>
          </v-card-text>
        </v-card>
        <v-alert v-else type="success" dense text class="mb-5">
          환영합니다, {{ loggedInUser }}!
        </v-alert>
      </v-container>

      <!-- 기존 UI 섹션 (로그인 성공 시 표시) -->
      <v-container fluid v-if="loggedInUser" :class="{'mt-5': loggedInUser}">
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
    const username = ref('') // 로그인 사용자 이름
    const password = ref('') // 로그인 비밀번호
    const loggedInUser = ref(null) // 로그인 성공 시 사용자 이름 저장
    const loginError = ref(null) // 로그인 에러 메시지
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
      loggedInUser.value = null; // 로그인 정보 초기화
      username.value = '';
      password.value = '';
      loginError.value = null;
    }

    // 로그인 메서드 추가
    async function login() {
      loginError.value = null; // 에러 메시지 초기화
      try {
        const response = await axios.post('http://localhost:8001/api/auth/login', {
          username: username.value,
          password: password.value,
        });
        if (response.data.user) {
          loggedInUser.value = response.data.user.name; // 사용자 이름 저장
        }
      } catch (error) {
        console.error('로그인 실패:', error);
        loginError.value = '아이디 또는 비밀번호를 다시 확인해주세요.';
        loggedInUser.value = null;
      }
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
      { title: 'Version', key: 'code', sortable: false },
      { title: 'Note', key: 'note', sortable: false },
    ];

    return {
      projectName,
      projects,
      shots,
      selectedShotName,
      username,
      password,
      loggedInUser,
      loginError,
      versions,
      onProjectSelected,
      loadVersions,
      clear,
      versionHeaders,
      dbTestResult,
      dbTestError, 
      testDbConnection,
      login
    }
  }
}
    
</script>

<style src="./assets/styles.css"></style>