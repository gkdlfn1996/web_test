<template>
  <div id="app">
    <input
      v-model="inputText"
      placeholder="Type here"
      style="width: 400px; padding: 8px;"
    />
    <div style="margin-top: 12px;">
      <button @click="send" style="padding: 8px 16px; margin-right:8px;">OK</button>
      <button @click="clear" style="padding: 8px 16px;">Clear</button>
    </div>
    <p style="font-size: 2rem; font-weight: bold; margin-top: 24px;">
      {{ label }}
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const inputText = ref('')
    const label = ref('')

    onMounted(async () => {
      const res = await fetch('/api/message')
      const data = await res.json()
      label.value = data.message
    })

    async function send() {
      const res = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.value })
      })
      const data = await res.json()
      label.value = data.echo
    }

    function clear() {
      inputText.value = ''
      label.value = ''
    }

    return {
      inputText,
      label,
      send,
      clear
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
