import { BaseApplication } from "./baseApplication";
import { httpServerCallback } from "./node/callback";
import * as http from 'node:http';

export class Application extends BaseApplication {


    listen(port: number) {
        const server = http.createServer(this.createCallback());
        return server.listen(port);
    }

    createCallback(): http.RequestListener {
        return httpServerCallback(this);
    }

    upgradeCallback() {

    }
}