<script lang="ts" setup>
import { Command } from '@tauri-apps/api/shell'

async function run() {
  const command = Command.sidecar('binaries/example')
  const output = await command.execute()
}
</script>

<template>
  <div>
    <TheProjectInfo />
    <UiButton @click="run">Run</UiButton>
  </div>
</template>
