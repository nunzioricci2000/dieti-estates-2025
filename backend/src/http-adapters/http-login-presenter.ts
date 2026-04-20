import type { Logger } from "@dieti-estates-2025/common";
import type { LoginPresenter } from "../auth/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { Response } from "./response.js";

export class HTTPLoginPresenter implements LoginPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(token: string): void {
        const body = new Map();
        body.set("token", token);
        const headers = new Map<string, string>();
        const response = new Response(
            200,
            body,
            headers,
        )
        this.responseManager.sendResponse(response);
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
    }
}