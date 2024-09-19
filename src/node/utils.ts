import { NodeHttpResponse } from "./callback";
import * as http2 from 'node:http2';

/**
 * Used to know if we can use new built in http2 features if server supports http2
 * @param res 
 * @returns 
 */
export const isHTTP2Response = (res: NodeHttpResponse): res is http2.Http2ServerResponse => {
    return (res as http2.Http2ServerResponse).stream !== undefined;
}