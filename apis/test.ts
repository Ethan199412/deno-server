
addEventListener("fetch", (event) => {
    console.log('[p1.0] fetch')
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
    return new Response("Hello, World!", { status: 200 });
}