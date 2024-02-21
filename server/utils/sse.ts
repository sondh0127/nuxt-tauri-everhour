import { setHeaders, setResponseStatus } from 'h3';
import type { H3Event } from 'h3';

interface Client {
  id: string;
  event: H3Event;
}

let clients: Client[] = []

export function useSSE() {

  function addClient({ id, event }: Client) {
    setHeaders(event, {
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'content-type': 'text/event-stream'
    });
    setResponseStatus(event, 200);

    clients.push({ id, event });
  }

  function removeClient(id: string) {
    const current = clients.find(client => client.id === id)
    if (current) {
      current.event.node.res.end()
    }
    clients = clients.filter((c) => c.id !== id);
  }

  function broadcast(client: Client, eventName: string, data: Record<string, any>) {
    client.event.node.res.write(`id: ${client.id}\n`);
    client.event.node.res.write(`event: ${eventName}\n`);
    client.event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  function broadcasts(eventName: string, data: Record<string, any>) {
    clients.forEach((client) => broadcast(client, eventName, data));
  }

  return {
    addClient,
    removeClient,
    broadcast,
    broadcasts
  }

}
