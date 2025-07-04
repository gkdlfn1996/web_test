<template>
  <div id="app">
    <div class="input-row">
      <input 
        v-model="projectName" 
        @keyup.enter="loadShots"
        placeholder="프로젝트 이름 입력" />
        <button @click="loadShots">OK</button>
        <button @click="clear">Clear</button>
    </div>

    <div class="table-container">
      <table v-if="shots.length" class="shots-table">
        <thead>
          <tr>
            <th>Shot</th><th>Task</th><th>Cut In</th><th>Cut Out</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shot in shots" :key="shot.id">
            <td>{{ shot.code }}</td>
            <td>{{ shot.sg_task }}</td>
            <td>{{ shot.sg_cut_in }}</td>
            <td>{{ shot.sg_cut_out }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchMessage, fetchShots } from './api'

export default {
  setup() {
    const projectName = ref('')
    const shots       = ref([])

    onMounted(async () => {
      // 초기 메시지 로드 (필요 없으면 주석 처리)
      await fetchMessage()
    })

    async function loadShots() {
      const data = await fetchShots(projectName.value)
      shots.value = data.shots || []
    }

    function clear() {
      projectName.value = ''
      shots.value = []
    }

    return { projectName, shots, loadShots, clear }
  }
}
</script>

<style>

</style>