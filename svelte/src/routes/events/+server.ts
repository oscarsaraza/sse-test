import type { RequestHandler } from "./$types";

let clients: Array<{
  id: number;
  controller: ReadableStreamDefaultController;
}> = [];

const notifyAllClients = (message: string) => {
  clients.forEach((client) => {
    client.controller.enqueue(`data: new message: ${message} \n\n`);
  });
};

/**
 * Handles the GET request by creating a new client ID, adding the client to the list of active clients,
 * and returning a new Response with a ReadableStream for server-sent events.
 *
 * @param {Object} request - the request object
 * @return {Promise<Response>} a Promise that resolves to a Response object
 */
export const GET: RequestHandler = async ({ request }) => {
  const newClientId = Date.now();

  const stream = new ReadableStream({
    start(controller) {
      clients.push({ id: newClientId, controller });
      controller.enqueue(`Welcome ${newClientId}`);
      notifyAllClients(`New connection ${newClientId}`);
    },
    cancel() {
      clients = clients.filter((client) => client.id !== newClientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
};
