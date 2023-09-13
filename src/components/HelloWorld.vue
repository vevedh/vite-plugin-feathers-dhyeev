<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessages } from '../store/messages.store.ts'
import { useAgents } from '../store/agents.store.ts'

defineProps<{ msg: string }>()

const agentsCacemStore = useAgents()
const messagesStore = useMessages()


let agentsCacem = reactive([])

agentsCacemStore.find({ query: {} })
  .then((r) => {
    console.log('Agents response', r)
    agentsCacem.push(...r.data)
  })
  .catch((r) => {
    console.log('messages REJECTIOJ', r)
  })

let messages = reactive([])
messages.push({ id: '0', text: 'Loading...' })
messagesStore
  .find({ query: {} })
  .then((r) => {
    console.log('messages response', r)
    messages.splice(0)
    messages.push(...r.data)
  })
  .catch((r) => {
    console.log('messages REJECTIOJ', r)
  })

const count = ref(0)
count.value = 69
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p v-for="m of messages">
      {{ m.text }}
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
