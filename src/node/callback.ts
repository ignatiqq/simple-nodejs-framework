import * as http from 'node:http';
import * as http2 from 'node:http2';
import { Context } from "../context";
import { Application } from '../application';
import { NodeResponse } from './nodeResponse';
import { NodeRequest } from './nodeRequest';
import { BodyType } from '../response';
import { Readable } from 'node:stream';

export type NodeHttpRequest = http.IncomingMessage | http2.Http2ServerRequest;
export type NodeHttpResponse = http.ServerResponse | http2.Http2ServerResponse;

export function httpServerCallback(app: Application) {
    return async function(req: NodeHttpRequest, res: NodeHttpResponse) {
        try {
            const context = new Context(
                new NodeRequest(req),
                new NodeResponse(res)
            );
            // run all code (middlewares)
            await app.handle(context);
            // send body if not sent
            sendBody(context.response.body, res);
        } catch (error) {
            console.error(error);
            // emit error to handle it
            // when listening like .listen().on('error', cb))
            if(app.listenerCount('error')) app.emit('error');
        }
    }
}

/**
 * If we set body value
 * but not sent it
 */
function sendBody(body: BodyType, res: NodeHttpResponse) {
    if(body === null) {
        res.end();
    } else if(typeof body === 'string' || body instanceof Buffer) {
        res.end(body);
    } else if(typeof body === 'object') {
        res.end(JSON.stringify(body, null , 2));
    } else if(body instanceof Readable) {
        body.pipe(res);
    } else {
        throw new TypeError('Unsupported type for body: ' + typeof body);
    }
}