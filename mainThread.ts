// Start listening on port 8080 of localhost.

/**
 * 1. 通过 Deno.listen 拿到 server
 */
 const server = Deno.listen({ port: 8081 });
 console.log(`HTTP webserver running.  Access it at:  http://localhost:8081/`);
 
 
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


        switch(url){
            case '/':
                for (let i = 0; i < 5000000000; i++) {

                }
                return requestEvent.respondWith(new Response('main api'))
            default:
                return requestEvent.respondWith(new Response('other api'))
                
        }
 
     }
 }
 

 
 