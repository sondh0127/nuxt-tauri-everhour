
<script lang="ts" setup>
const props = defineProps<{ projectId: string }>()

const { projectId } = toRefs(props)

const section = ref(858444)

async function getTask() {
  const id = projectId.value
  const res = await Promise.all([
    $fetch(`/projects/${id}/tasks`, {
      query: {
        page: 1,
        excludeClosed: false
      }
    }),
    $fetch(`/projects/${id}/tasks`, {
      query: {
        page: 2,
        excludeClosed: false
      }
    }),
    $fetch(`/projects/${id}/tasks`, {
      query: {
        page: 3,
        excludeClosed: false
      }
    })
  ])

  const flattened = res.flat().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }).filter(task => task.section === section.value)

  return flattened
}

const { data, ...query } = useQuery({
  queryKey: [QUERY_KEYS.PROJECTS_TASKS],
  queryFn: getTask,
  enabled: () => !!projectId.value
})


// Mutation

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: async (payload: { name: string, hour: number }) => {
    const res = await $fetch(`/projects/${projectId.value}/tasks`, {
      method: 'POST',
      body: {
        name: payload.name,
        section: section.value
      }
    })

    const res2 = await $fetch(`/tasks/${res.id}/estimate`, {
      method: 'PUT',
      body: {
        total: payload.hour * 60 * 60,
        type: 'overall',
      }
    })
    return res
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
  },
})

const taskScope = ref('')
const taskText = ref('')
const taskHour = ref('')
const { startMutation } = useTimerMutation()

async function addTask() {
  const name = `[${taskScope.value}] ${taskText.value}`
  const hour = Number(taskHour.value)

  const res = await mutation.mutateAsync({
    name,
    hour,
  })

  const id = res.id

  await startMutation.mutateAsync(id)

  taskScope.value = ''
  taskText.value = ''
  taskHour.value = ''
}

const { data: dataCurrent, ...queryCurrent } = useQuery({
  queryKey: [QUERY_KEYS.TIMERS_CURRENT],
  queryFn: () => $fetch<any>(QUERY_KEYS.TIMERS_CURRENT),
})

const currentId = computed(() => dataCurrent.value?.task?.id)

</script>

<template>
  <div class="my-10">

    <TheQueryWrapper v-bind="query">
      <div>
        <div>Today Time:</div>
      </div>
      <div v-for="item in data" :key="item.id" class="grid grid-cols-[1fr_auto_auto] gap-2 items-center" :class="[
        currentId === item.id ? 'bg-green' : ''
      ]">
        <div>
          {{ item.name }}
        </div>
        <div>
          {{ item.estimate.total / 60 / 60 }}h
        </div>
        <TheTaskActions :id="item.id" :running="item.id === currentId" />
      </div>
    </TheQueryWrapper>
    <div class="grid grid-cols-5 gap-2">
      <UiInput class="" v-model="taskScope" />
      <UiInput class="col-span-2" v-model="taskText" />
      <UiInput type="number" v-model="taskHour" />
      <UiButton @click="addTask" :loading="mutation.isPending.value">Add Task</UiButton>
    </div>
  </div>
</template>
