export default defineEventHandler(async (event) => {
  const sse = useSSE()

  const body = await readBody(event)
  if (body) {
    sse.broadcasts(body.event, body)
  }
  return {
    success: true
  }
})
