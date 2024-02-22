<script setup lang="ts">
useHead({
  title: 'Everhour Son'
})

const config = useRuntimeConfig()
</script>

<template>
  <DevOnly>
    <details open>
      <summary>config</summary>
      <pre>{{ JSON.stringify(config, null, 2) }}</pre>
    </details>
  </DevOnly>
  <div class="flex container mx-auto">
    <NuxtPage />
  </div>
</template>
