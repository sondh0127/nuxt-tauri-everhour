<script lang="ts" setup>
const props = defineProps<{ id: string, running?: boolean }>()

const queryClient = useQueryClient()

const { startMutation } = useTimerMutation()

async function startTask() {
  await startMutation.mutateAsync(props.id)
}


const stopMutation = useMutation({
  mutationFn: async () => {
    const res = await $fetch(QUERY_KEYS.TIMERS_CURRENT, {
      method: 'DELETE',
    })
    return res
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMERS_CURRENT] })
  },
})
async function stopTask() {
  await stopMutation.mutateAsync()
}
</script>

<template>
  <div class="flex gap-1">
    <UiButton v-if="!running" @click="startTask" size="sm" :loading="startMutation.isPending.value">
      <div class="i-lucide:play-circle size-5" />
    </UiButton>
    <UiButton v-else @click="stopTask" size="sm" variant="destructive">
      <div class="i-lucide:stop-circle size-5" />
    </UiButton>
  </div>
</template>
