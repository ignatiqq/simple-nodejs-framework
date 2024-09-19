import { HeadersInterface, HeadersObject } from '../headers';
import { NodeHttpResponse } from './callback';

export class NodeHeaders implements HeadersInterface {

  private inner: NodeHttpResponse;

  constructor(inner: NodeHttpResponse) {
    this.inner = inner;
  }

  set(name: string, value: string) {
    this.inner.setHeader(name, value);
  }

  get(name: string): string|null {
    const value = this.inner.getHeader(name);
    if (value === undefined || value === null) {
      return null;
    } else if (typeof(value) === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return value.toString();
    }
  }

  getMany(name: string): string[] {
    const value = this.inner.getHeader(name);

    if (value === undefined || value === null) {
      return [];
    } else if (Array.isArray(value)) {
      return value;
    } else {
      return [value.toString()];
    }
  }

  has(name: string): boolean {
    return !!this.inner.getHeader(name);
  }

  delete(name: string): void {
    this.inner.removeHeader(name);
  }

  getAll(): HeadersObject {
    // @ts-expect-error
    return this.inner.getHeaders();

  }
  append(name: string, value: string | string[] | number): void {
    let oldValue = this.inner.getHeader(name);
    if (oldValue === undefined) {
      oldValue = [];
    }
    if (!Array.isArray(oldValue)) {
      oldValue = [oldValue.toString()];
    }
    this.inner.setHeader(name, oldValue.concat(value as string[]|string));
  }
}
