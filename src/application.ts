import { BaseApplication } from "./baseApplication";
import { httpServerCallback } from "./node/callback";
import { WebSocket, WebSocketServer } from 'ws';
import * as http from 'node:http';
import { NodeRequest } from "./node/nodeRequest";
import { Context } from "./context";
import { Response } from "./response";
import * as net from 'node:net';

export class Application extends BaseApplication {
    private wsServer: WebSocketServer | undefined;

    listen(port: number) {
        const server = http.createServer(this.createCallback());
        // switch between protocols if needed
        // No need to have different WS server we can use one and switch between protocols if needed or just use one
        // works only with ws req.headers.upgrade === 'websocket'
        server.on('upgrade', this.upgradeCallback.bind(this));
        return server.listen(port);
    }

    createCallback(): http.RequestListener {
        return httpServerCallback(this);
    }

    upgradeCallback(request: http.IncomingMessage, socket: net.Socket, head: Buffer) {
        if(!this.wsServer) {
            this.wsServer = new WebSocketServer({ noServer: true });

            this.wsServer.on('connection', async(ws, req) => {
                const context = new Context(
                    new NodeRequest(req),
                    new Response()
                );

                context.webSocket = ws;
                await this.handle(context);
            });
        }

        this.wsServer.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            this.wsServer!.emit('connection', ws, request);
        });
    }
}