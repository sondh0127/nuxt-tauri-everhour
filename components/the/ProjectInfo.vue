<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";


const greetMsg = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // greetMsg.value = await invoke("greet", { name: name.value });
}

const { data, ...query } = useQuery({
  queryKey: [QUERY_KEYS.PROJECTS],
  queryFn: () => $fetch<any>('/projects', { query: { limit: 1 } }),
})
const projectId = computed(() => data.value[0].id)

const WEBHOOK_ID = useLocalStorage('WEBHOOK_ID', '')

const config = useRuntimeConfig()

async function createWebhook() {
  if (!projectId.value) return

  const body = {
    "targetUrl": `${config.public.domain}/api/webhook`,
    "events": [
      "api:timer:stopped",
      "api:timer:started"
    ],
    "project": projectId.value
  }

  if (WEBHOOK_ID.value) {
    await $fetch(`/hooks/${WEBHOOK_ID.value}`, {
      method: 'DELETE',
    })
    WEBHOOK_ID.value = undefined
  }
  const res = await $fetch('/hooks', {
    method: 'POST',
    body: body
  })

  WEBHOOK_ID.value = res.id
}



const {
  isSupported,
  notification,
  show,
  close,
  onClick,
  onShow,
  onError,
  onClose,
} = useWebNotification({
  title: 'Timer stop',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'timer',
})

const eventSource = ref<EventSource>()

function connectSse() {
  eventSource.value = new EventSource('/api/sse')

  eventSource.value.addEventListener('connected', (data) => {
    console.log('sse:connected', data)
  })

  eventSource.value.addEventListener('api:timer:started', (data) => {
    alert('api:timer:started')
    console.log(data)
  })

  eventSource.value.addEventListener('api:timer:stopped', (data) => {
    if (isSupported.value)
      show()
  })
}

onMounted(connectSse)

onBeforeUnmount(() => {
  eventSource.value?.close()
})
</script>

<template>
  <div>
    <TheQueryWrapper v-bind="query">
      <TheTasks :project-id="projectId" />
    </TheQueryWrapper>
    <UiButton @click="createWebhook">Create webhooks</UiButton>
  </div>
</template>
