import { MiddlewareFunction, invokeMiddlewares } from "../baseApplication";
import { match } from 'path-to-regexp';
import * as http from 'http';

type HttpMethodsAssignerFunc = (...mws: MiddlewareFunction[]) => HttpMethodsAssigner;
type Methods = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put';
type HttpMethodsAssigner = Record<Methods, HttpMethodsAssignerFunc> & MiddlewareFunction;

export function route(path: string, callback?: MiddlewareFunction) {
    if(callback) {
        return createSingleRoute(path, callback);
    }
    return createManyRoutes(path);
}

// app.use(route('/test').get((ctx, next) => {...}))
function createManyRoutes(path: string) {
    const pathRegex = match(path);

    const realizedMethods: {[method: string]: MiddlewareFunction[]} = {};
    
    const middlewareFn: MiddlewareFunction = (ctx, next) => {
        if(!pathRegex(ctx.request.path)) return next();

        // @ts-ignore
        ctx.router = {
            matchedRoute: path
        }

        return invokeMiddlewares(ctx, [
            ...realizedMethods[ctx.request.method],
            () => next()
        ])
    }

    // assign all possible methods to fn to fill it with callbacks
    const httpMethodsAssigner: HttpMethodsAssigner = Object.assign(middlewareFn, {} as Record<Methods, HttpMethodsAssignerFunc>);

    for (const method of http.METHODS) {
        httpMethodsAssigner[method.toLocaleLowerCase() as Methods] = (...middlewares: MiddlewareFunction[]) => {
            realizedMethods[method] = middlewares;
            return httpMethodsAssigner;
        }
    }
    
}

// app.use(route('/test', (ctx, next) => {...}))
function createSingleRoute(path: string, ...middleware: MiddlewareFunction[]): MiddlewareFunction {
    const pathRegex = match(path);

    return async (ctx, next) => {
        if(!pathRegex(ctx.request.path)) return next();

        // @ts-ignore
        ctx.router = {
            matchedRoute: path
        }

        await invokeMiddlewares(ctx, [...middleware, () => next()]);
    }
}