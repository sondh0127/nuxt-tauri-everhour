export function useTimerMutation() {
  const queryClient = useQueryClient()

  const startMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await $fetch('/timers', {
        method: 'POST',
        body: {
          task: id
        }
      })
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMERS_CURRENT] })
    },
  })

  return {
    startMutation
  }
}
