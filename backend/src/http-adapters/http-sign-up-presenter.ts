import { type Logger, Response } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";
import { UserAlreadySignedException } from "../auth/errors.js";

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
        const response = new Response(200, body, headers);
        this.responseManager.sendResponse(response);
    }

    presentError(error: Error): void {
        let res: Response;
        if(error instanceof UserAlreadySignedException) {
            res = Response.CONFLICT;
        } else {
            res = Response.SERVER_ERROR;
        }
        this.responseManager.sendResponse(res);
        this.logger.debug("Error during signup. Error response was sent.");
    }
}
