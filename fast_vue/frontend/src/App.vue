<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const message = ref('Loading...')
    
    onMounted(async () => {
      console.log('▶ onMounted 실행됨')  // 여기가 출력되어야 fetch가 호출된 것
      try {
        const resp = await fetch('/api/message')
        if (!resp.ok) {
          console.error('네트워크 오류:', resp.status, resp.statusText)
          throw new Error('네트워크 오류')
        }
        const data = await resp.json()
        console.log('✅ API 응답 데이터:', data)
        message.value = data.message
      } catch (err) {
        console.error('Fetch 에러:', err)
        message.value = 'Error fetching message'
      }
    })

    return { message }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}
</style>