import { Request } from 'https://deno.land/std/http/server.ts';

addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  event.respondWith(handleRequest(request));
});

async function handleRequest(req: Request) {
  console.log(`Request for ${req.url}`);

  const body = 'Hello, World!';

  return new Response(body);
}