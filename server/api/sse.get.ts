import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const sse = useSSE()

  const client = {
    id: randomUUID(),
    event,
  }
  sse.addClient(client)

  sse.broadcast(client, 'connected', { message: 'Connected established' })

  event.node.res.on('close', () => sse.removeClient(client.id))
  event._handled = true
})
