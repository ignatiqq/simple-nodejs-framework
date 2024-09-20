import { Application } from "../application";
import { route } from "../integrations/router";

const server = new Application();

server.use((ctx, next) => {
    if(ctx.request.path.includes('.ico')) {
        return ctx.response.end('static');
    }
    next();
})

server.use((ctx, next) => {
    ctx.state['test'] = 'something';
    next();
});


server.use((ctx, next) => {
    next();
});

server.use(route('/test', (ctx, next) => {
    ctx.response.headers.set('Content-type', 'text/html');
    ctx.response.body = '<div>Hello world</div>';
    next();
}));


server.use(route('/test/hello', (ctx, next) => {
    ctx.response.headers.set('Content-type', 'application/json');
    ctx.response.body = JSON.stringify([{value: '1'}]);
    next();
}));

server.listen(3333);