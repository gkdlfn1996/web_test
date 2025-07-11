<template>
  <v-app>
    <v-main>
      <!-- 로그인 섹션 (로그인되지 않았을 때만 표시) -->
      <LoginSection
        v-if="!loggedInUser"
        :username="username"
        :password="password"
        :loginError="loginError"
        @update:username="username = $event"
        @update:password="password = $event"
        @login="login"
      />

      <!-- 로그인 성공 시 표시되는 메인 UI -->
      <v-container fluid v-else-if="loggedInUser" :class="{'mt-5': loggedInUser}">
        <v-alert type="success" dense text class="mb-5">
          <span>환영합니다, {{ loggedInUser }}!</span>
        </v-alert>

        <!-- 샷 선택 컴포넌트 -->
        <ShotSelector
          :projectName="projectName"
          :projects="projects"
          :shots="shots"
          :selectedShotName="selectedShotName"
          @update:projectName="projectName = $event"
          @update:selectedShotName="selectedShotName = $event"
          @onProjectSelected="onProjectSelected"
          @loadVersions="loadVersions"
          @clear="clear"
        />

        <!-- 버전 테이블 컴포넌트 -->
        <VersionTable
          :versions="versions"
          :notes="notesContent"
          @save-note="saveNote"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue'; // onMounted는 App.vue에서 직접 사용
import useAuth from './composables/useAuth'; // 인증 로직
import useShotGridData from './composables/useShotGridData'; // ShotGrid 데이터 로직
import useNotes from './composables/useNotes'; // 노트 로직
import { fetchVersionsForShot } from './api'; // API 호출 함수

import LoginSection from './components/LoginSection.vue'; // 로그인 컴포넌트
import ShotSelector from './components/ShotSelector.vue'; // 샷 선택 컴포넌트
import VersionTable from './components/VersionTable.vue'; // 버전 테이블 컴포넌트


export default {
  components: {
    LoginSection,
    ShotSelector,
    VersionTable,
  },
  setup() {
    const auth = useAuth();
    const shotGridData = useShotGridData();
    const notes = useNotes(auth.loggedInUserId);

    // App.vue의 onMounted 로직
    onMounted(async () => {
      const storedUser = sessionStorage.getItem('loggedInUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        auth.loggedInUser.value = user.name; // useAuth의 loggedInUser 업데이트
        auth.loggedInUserId.value = user.id; // useAuth의 loggedInUserId 업데이트
      }
      await shotGridData.loadProjects();
    });

    // loadVersions 함수는 App.vue에서 직접 관리 (ShotGridData와 Notes를 연결)
    const loadVersions = async () => {
      try {
        const selectedShot = shotGridData.shots.value.find(s => s.code === shotGridData.selectedShotName.value);
        if (!selectedShot) return;

        const versionData = await fetchVersionsForShot(selectedShot.id);
        const loadedVersions = versionData.versions || [];

        // useNotes의 loadVersionNotes 함수를 호출하여 노트 데이터 로딩
        await notes.loadVersionNotes(loadedVersions);

        // 모든 데이터가 준비되면 버전 목록 업데이트 (UI 렌더링 유발)
        shotGridData.setVersions(loadedVersions);

      } catch (error) {
        console.error("Error loading versions and notes:", error);
        // 사용자에게 에러를 알리는 로직을 추가할 수 있습니다.
      }
    };

    // Clear 함수 (App.vue에서 직접 관리)
    const clear = () => { // useShotGridData의 clear 로직을 호출
      shotGridData.projectName.value = '';
      shotGridData.shots.value = [];
      shotGridData.versions.value = [];
      shotGridData.selectedShotName.value = '';
      auth.loginError.value = null;
      notes.notesContent.value = {}; // 노트 내용도 초기화
    };

    return {
      // useAuth에서 노출된 속성/함수
      username: auth.username,
      password: auth.password,
      loggedInUser: auth.loggedInUser,
      loginError: auth.loginError,
      login: auth.login,

      // useShotGridData에서 노출된 속성/함수
      projectName: shotGridData.projectName,
      projects: shotGridData.projects,
      shots: shotGridData.shots,
      selectedShotName: shotGridData.selectedShotName,
      versions: shotGridData.versions,
      onProjectSelected: shotGridData.onProjectSelected,

      // useNotes에서 노출된 속성/함수
      notesContent: notes.notesContent,
      saveNote: notes.saveNote,

      // App.vue에서 직접 관리하는 속성/함수
      loadVersions,
      clear,
    };
  },
};
</script>

<style src="./assets/styles.css"></style>