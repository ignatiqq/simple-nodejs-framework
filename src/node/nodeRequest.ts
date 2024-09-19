import { NodeHttpRequest } from "./callback";
import { Headers } from "../headers"; 
import { Request } from "../request";

export class NodeRequest<T> extends Request {
    inner: NodeHttpRequest;

    constructor(inner: NodeHttpRequest) {
        super(inner.method!, inner.url!);
        // @ts-expect-error
        this.headers = new Headers(inner.headers);
        this.inner = inner;
    }

    ip(isTrustProxy: boolean) {
        if(isTrustProxy) {
            const forwarded = this.headers.get('X-Forwarded-For');

            if(forwarded) {
                return forwarded.split(',')[0].trim();
            }
        }

        return this.inner.socket.remoteAddress;
    }
}