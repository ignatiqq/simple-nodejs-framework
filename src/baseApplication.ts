import { EventEmitter } from "node:events";
import { Context } from "./context";

/**
 * Функция миддлвар
 */
type MiddlewareFunction = (
    // Каждый миддлвар должен получать аргументом контекст определенного запроса
    ctx: Context,
    next: () => Promise<void>
  ) => Promise<void> | void;

async function invokeMiddlewares(ctx: Context, mws: MiddlewareFunction[]) {
  if(!mws.length) return;

  const middleware = mws[0];

  return middleware(ctx, async () => {
    await invokeMiddlewares(ctx, mws.slice(1));
  });
}

/**
 * EventEmitter based application
 */
export class BaseApplication extends EventEmitter {
    middlewares: Array<MiddlewareFunction> = [];

    use(...midleware: MiddlewareFunction[]) {
      this.middlewares.push(...midleware);
    }

    /**
     * Async because of our code async nature
     * it needs to be async because we need to make sure that all our code was done
     * and all async tasks are done
     * only after that (if we do not sent it before in middlewares) we can send body 
     * Thats why we need ut to be async and await for all middlewares we have
     */
    async handle(ctx: Context) {
      ctx.response.headers.set('x-powered-by', 'Deep-Dive-Perf');
      // base response type
      ctx.response.type = 'application/hal+json';
      await invokeMiddlewares(ctx, this.middlewares);
    }
} 