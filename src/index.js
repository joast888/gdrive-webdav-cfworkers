import GoogleDrive from './drive';

const gd = new GoogleDrive();

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    let response;
    const method = request.method;
    if (method === 'GET') {
        if (path.slice(-1) === '/')
            response = await gd.fetchList(path);
        else
            response = await gd.fetchFile(path, request.headers.get('Range'));
    }
    // else if (method === 'POST') {
    //
    // } else if (method === 'PUT') {
    //
    // }
    else {
        response = new Response(null, {status: 405})
    }

    // CORS config
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', url.origin);
    return response;
}