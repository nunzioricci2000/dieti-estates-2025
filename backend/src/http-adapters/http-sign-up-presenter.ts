import type { Logger } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";
import { Response } from "./response.js";

export class HTTPSignupPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(token: string): void {
        const body = new Map<string, any>();
        const headers = new Map<string, string>();
        body.set("token", token);
        const response = new Response(200, body, headers);
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
    }
}
