<template>
  <v-app>
    <v-main>
      <div id="app">
        <div class="input-row">
          <v-autocomplete
            v-model="projectName"
            label="Project"
            :items="projects"
            @keyup.enter="loadShots"
          ></v-autocomplete>
          <v-btn @click="loadShots">OK</v-btn>
          <v-btn @click="clear">Clear</v-btn>
        </div>
        <div class="table-container">
          <table v-if="shots.length" class="shots-table">
            <thead>
              <tr>
                <th>Shot</th>
                <th>Task</th>
                <th>Cut In</th>
                <th>Cut Out</th>
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
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchShots, fetchProjects } from './api'

export default {
  setup() {
    const projectName = ref('')
    const projects = ref([])
    const shots = ref([])

  onMounted(
      async () => {
        const projData = await fetchProjects()
        projects.value = projData.projects || []
    })

    async function loadShots() {
      const data = await fetchShots(projectName.value)
      shots.value = data.shots || []
    }

    function clear() {
      projectName.value = ''
      shots.value = []
    }

    return { projectName, projects, shots, loadShots, clear }
  }
}
</script>

<style src="./assets/styles.css"></style>