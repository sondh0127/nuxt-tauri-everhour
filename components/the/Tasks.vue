
<script lang="ts" setup>
const props = defineProps<{ projectId: string }>()

const { projectId } = toRefs(props)

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
  }).filter(task => task.iteration !== 'Completed')

  return flattened
}

const { data, ...query } = useQuery({
  queryKey: ['tasks'],
  queryFn: getTask,
  enabled: () => !!projectId.value
})


// Mutation

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: (payload: { text: string, time: string }) => $fetch(`/projects/${projectId.value}/tasks`, {

  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

function onButtonClick() {
  mutation.mutate({
    id: Date.now(),
    title: 'Do Laundry',
  })
}

function addTask() {
console.log('[LOG] ~ addTask:', addTask)

}
</script>

<template>
  <div>
    <QueryWrapper v-bind="query">
      <div v-for="item in data" :key="item.id">
        <DevOnly>
          <details open>
            <summary>item</summary>
            <pre>{{ JSON.stringify(item, null, 2) }}</pre>
          </details>
        </DevOnly>
      </div>
    </QueryWrapper>

    <button @click="addTask">Add Task</button>
  </div>
</template>
