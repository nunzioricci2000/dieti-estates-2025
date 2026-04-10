export class Request {
    method: string;
    path: string;
    query: Map<string, any>;
    headers: Map<string, string>;
    body: Map<string, any>;
    pathParams: Map<string, string>;

    constructor(method: string, path: string, query: Map<string, any>, 
        headers: Map<string, string>, body: Map<string, any>, 
        pathParams: Map<string, string>)
    {
            this.method = method;
            this.path = path;
            this.query = query;
            this.headers = headers;
            this.body = body;
            this.pathParams = pathParams;
        }
}

/*
import type { Logger } from "@dieti-estates-2025/utilities";
import type { ResponseManager } from "./response-manager.js";
import type { Agent } from "@dieti-estates-2025/entities";
import { Response } from "./response.js";

export class _ {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(agent: Agent): void {
        const body = new Map<string, any>();
        const headers = new Map<string, string>();

        const res = new Response(
            200,
            body, 
            headers,
        )
        this.responseManager.sendResponse(res);
        this.logger.debug("Success response sent");
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.debug("Error response sent");
    }
}
    
*/