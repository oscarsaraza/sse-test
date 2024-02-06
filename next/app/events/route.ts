let clients: Array<{
  id: number;
  controller: ReadableStreamDefaultController;
}> = [];

const notifyAllClients = (message: string) => {
  clients.forEach((client) => {
    client.controller.enqueue(`data: new message: ${message} \n\n`);
  });
};

export const dynamic = "force-dynamic";

export const GET = async () => {
  const newClientId = Date.now();

  const stream = new ReadableStream({
    start(controller) {
      clients.push({ id: newClientId, controller });
      controller.enqueue(`Welcome ${newClientId}`);
      notifyAllClients(`New connection ${newClientId}`);
    },
    cancel() {
      notifyAllClients(`Disconnected -> ${newClientId}`);
      clients = clients.filter((client) => client.id !== newClientId);
    },
  });

  const response = new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });

  return response;
};

export const POST = async (request: Request) => {
  const body = await request.json();

  notifyAllClients(`Disconnected -> ${body.msg}`);

  return Response.json({ ok: true });
};
