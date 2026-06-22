export function createSSEStream(handler: (controller: ReadableStreamDefaultController) => Promise<void>): Response {
  // SSE over WebSockets: no infra, Vercel Edge compatible, automatic reconnect
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await handler(controller);
      } catch (error) {
        emitEvent(controller, "error", { message: (error as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export function emitEvent(controller: ReadableStreamDefaultController, type: string, data: any): void {
  const dataString = JSON.stringify(data);
  controller.enqueue(new TextEncoder().encode(`event: ${type}\ndata: ${dataString}\n\n`));
}
