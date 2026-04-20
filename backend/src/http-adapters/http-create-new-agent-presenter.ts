import { type Logger, Agent, Response } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";

export class HTTPCreateNewAgentPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(agent: Agent): void {
        const body = {
            username: agent.username,
            email: agent.email,
        }
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
