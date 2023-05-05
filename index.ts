// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

const maps: { [key: string]: any } = {};
const global: Record<string, any> = {};

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection individually
    // without awaiting the function
    serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
        let { url } = requestEvent.request
        url = new URL(url).pathname

        await handleApi(url, requestEvent)

        console.log('[p0.1] url', url)
        // The native HTTP server uses the web standard `Request` and `Response`
        // objects.
        const body = `Your user-agent is:\n\n${requestEvent.request.headers.get(
            "user-agent",
        ) ?? "Unknown"
            }`;
        // The requestEvent's `.respondWith()` method is how we send the response
        // back to the client.
        requestEvent.respondWith(
            new Response(body, {
                status: 200,
            }),
        );
    }
}

async function handleApi(url: string, requestEvent: Deno.RequestEvent) {
    url = '.' + url + '.ts'
    let existPath = await Deno.lstat(url).then(() => true).catch(() => false)
    console.log('[p0.2] existPath', url, existPath, import.meta.url)

    if (!existPath) {
        return false
    }

    const worker = new Worker(new URL(url, import.meta.url).href, {
        type: 'module',
    });

    worker.postMessage({path: url, type: 'fetch'})
   
}

