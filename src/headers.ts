/**
 * This interface represents a set of HTTP headers.
 */
export interface HeadersInterface {
    set(name: string, value: string | string[] | number): void;
    get(name: string): string|null;
    has(name: string): boolean;
    delete(name: string): void;
    getAll(): HeadersObject;
  }
  
export type HeadersObject = {
  [headerName: string]: string | string[] | number;
};

/**
 * Объект хедера будет содержать хранилище и методы содержащие представление
 * хедеров как строк
 */
export class Headers implements HeadersInterface {
    private store: {
      [name: string]: string | string[] | number;
    };
  
    constructor(headersObj: HeadersObject = {}) {
      this.store = {};
      for (const key of Object.keys(headersObj)) {
        this.set(key, headersObj[key]);
      }
    }
  
    set(name: string, value: string | string[] | number): void {
      this.store[name.toLowerCase()] = value;
    }

    get(name: string): string|null {
  
      const value = this.store[name.toLowerCase()];
      if (value === undefined) {
        return null;
      }

      if (typeof(value) === 'string') {
        return value;
      } else if (Array.isArray(value)) {
        return value.join(', ');
      } else {
        return value.toString();
      }
  
    }

    has(name: string): boolean {
      return this.store[name.toLowerCase()] !== undefined;
    }
  
    getAll(): HeadersObject {
      const result: HeadersObject = {};

      for (const headerName of Object.keys(this.store)) {
        result[headerName] = this.store[headerName];
      }

      return result;
    }
  
    delete(name: string): void {
      delete this.store[name.toLowerCase()];
    }
}  