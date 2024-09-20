import { HeadersInterface, HeadersObject } from "../headers";
import { NodeHttpResponse } from "./callback";
import {NodeHeaders} from "./nodeHeaders";
import { Response } from "../response";
import { isHTTP2Response } from "./utils";
import { promisify } from 'node:util';
import * as http from 'node:http';

export class NodeResponse<T> implements Response<T> {
    private bodyValue!: T | null;
    headers: HeadersInterface;
    inner: NodeHttpResponse;
    userStatus: boolean;

    constructor(inner: NodeHttpResponse) {
        this.userStatus = false;
        this.inner = inner;
        this.status = 200;
        this.bodyValue = null;
        this.headers = new NodeHeaders(inner);
        // @ts-expect-error
        this.body = null
    }

    get type(): string {
        const contentType = this.headers.get('content-type');

        if(!contentType) return '';

        return contentType.split(';')[0];
    }

    set type(value: string) {
        this.headers.set('content-type', value);
    }

    get status(): number {
        return this.inner.statusCode;
    }

    set status(value: number) {
        this.userStatus = true;
        this.inner.statusCode = value;
    }
    
    set body(value: T) {
        if(!this.userStatus) {
            this.inner.statusCode = 200;
        }
        this.bodyValue = value;
    }

    get body(): T {
        // @ts-expect-error
        return this.bodyValue;
    }

    end(body?: string) {
        if(body) return this.inner.end(body);
        this.inner.end();
    }

    redirect(address: string): void {
        this.status = 303;
        this.headers.set('Location', address);
    }

    async sendInformational(status: 101 | 102 | 103, headers: HeadersObject = {}) {

        if(isHTTP2Response(this.inner)) {
            this.inner.stream.additionalHeaders({
                ':status': status,
                ...headers
            })
        } else {

            const rawHeaders = [];
            
            for (const headerName of Object.keys(headers)) {
                const headerValue = headers[headerName];

                if(Array.isArray(headerValue)) {
                    for (const headerVal of headerValue) {
                        rawHeaders.push(`${headerName}: ${headerVal}\r\n`);
                    }
                } else {
                    rawHeaders.push(`${headerName}: ${headerValue}\r\n`);
                }
            }

            // @ts-ignore
            const writeRaw = promisify(this.inner._writeRaw.bind(this.inner));
            await writeRaw(`HTTP/1.1 ${status} ${http.STATUS_CODES[status]}\r\n${rawHeaders.join('')}\r\n`, 'ascii');
        }
    }
}