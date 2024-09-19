import { Readable, Writable } from "node:stream";
import { Headers, HeadersInterface } from "./headers";

export type BodyType =
  Buffer |
  Record<string, any> |
  string |
  null |
  Readable |
  ((writeable: Writable) => void);

/**
 * Класс для определения основной функциональности ответа в разных средах исполнения
 */
export class Response<T = BodyType> {
    status: number;
    headers: HeadersInterface;
    body!: T;

    constructor() {
        this.status = 200;
        this.headers = new Headers();
    }

    /**
     * Content-type фунционал
     */
    get type(): string {
        const contentType = this.headers.get('content-type');
        if(!contentType) return '';
        return contentType.split(';')[0];
    }

    set type(value: string) {
        this.headers.set('content-type', value);
    }

    redirect(address: string): void {}
}