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
</script>

<template>
  <div>
    <TheQueryWrapper v-bind="query">
      <TheTasks :project-id="projectId" />
    </TheQueryWrapper>

  </div>
</template>
