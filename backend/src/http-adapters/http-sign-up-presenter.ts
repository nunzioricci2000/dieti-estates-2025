import { type Logger, Response } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";

export class HTTPSignupPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(token: string): void {
        const body = {
            token: token,
        }
        const headers = new Map<string, string>();
        body.set("token", token);
        const response = new Response(200, body, headers);
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.debug("Error during signup. Error response was sent.");
    }
}
