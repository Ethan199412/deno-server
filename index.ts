// Start listening on port 8080 of localhost.

/**
 * 1. 通过 Deno.listen 拿到 server
 */
const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);


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
        console.log('[p0.1] url', url)

        await handleApi(url, requestEvent)
    }
}

async function handleApi(url: string, requestEvent: Deno.RequestEvent) {
    url = '.' + url + '.ts'
    let existPath = await Deno.lstat(url).then(() => true).catch(() => false)
    console.log('[p0.2] existPath', url, existPath, import.meta.url)

    if (!existPath) {
        return requestEvent.respondWith(new Response('no such api'))
    }

    const worker = new Worker(new URL(url, import.meta.url).href, {
        type: 'module',
    });

    worker.onmessage = ({data}) => {
        console.log('[p0.3] I get response from worker data', data)
        requestEvent.respondWith(new Response(data))
    }

    worker.postMessage(requestEvent.request)
}

