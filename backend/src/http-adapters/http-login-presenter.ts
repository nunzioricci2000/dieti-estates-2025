import { type Logger, Response } from "@dieti-estates-2025/common";
import type { LoginPresenter } from "../auth/interfaces.js";
import type { ResponseManager } from "./response-manager.js";

export class HTTPLoginPresenter implements LoginPresenter {
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
        const response = new Response(200, body, headers);
        this.responseManager.sendResponse(response);
        this.logger.debug("Login performed. Response containing token was sent.");
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.debug("Error during login. Error response was sent.");
    }
}
