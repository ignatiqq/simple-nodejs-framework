import { Headers } from "./headers"; 
import url from 'node:url';

/**
 * Абстрактный класс для определения основной функциональности запроса в разных средах исполнения
 */
export abstract class Request<T = unknown> {
    method: string;
    requestUrlTarget: string;
    headers: Headers;
    body!: T;

    constructor(method: string, requestUrlTarget: string) {
        this.method = method;
        this.requestUrlTarget = requestUrlTarget;
        this.headers = new Headers();
    }

    get path() {
        return url.parse(this.requestUrlTarget).pathname!;
    }

    get query(): { [s: string]: string } {
        return url.parse(this.requestUrlTarget, true).query as any;
    }
}