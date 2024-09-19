import { HeadersInterface } from "../headers";
import { NodeHttpResponse } from "./callback";
import {NodeHeaders} from "./nodeHeaders";
import { Response } from "../response";

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

    redirect(address: string): void {
        this.status = 303;
        this.headers.set('Locatio', address);
    }
}