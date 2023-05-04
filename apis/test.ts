// import 'worker'
addEventListener('fetch', async (e) => {
    const body = 'abc';
    console.log('[p1.0] body', body)
    e.responseWith(new Response(body, { status: 200 }))
})