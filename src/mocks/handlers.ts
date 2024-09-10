
import {http, HttpResponse} from 'msw';

export const handlers = [
    http.get('/protected-route', ({ request }) => {
        const url = new URL(request.url);
        // You can access query parameters, path parameters, cookies, etc. using the request object
        return new HttpResponse('Forbidden', {
            status: 403,
            headers: { 'Content-Type': 'text/plain' }
        });
    }),
    // Add more handlers as needed
];