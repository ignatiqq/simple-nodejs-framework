import { WebSocket } from "ws";
import { Request } from "./request";
import { Response } from "./response";

/**
 * У каждого запроса в приложении должен быть свой контекст, который
 * будет содержать всю мету-информацию которую можно прикрепить к запросу
 * соответственно к объекту request или response
 *  
 * Этот контекст будет использоваться в "use" методе "Application"
 * тем самым каждый миддлвар будет получать контекст запроса и ответа
 */
export class Context {
    request: Request;
    response: Response;
    webSocket?: WebSocket;

    constructor(req: Request, res: Response) {
        this.request = req;
        this.response = res;
    }
}