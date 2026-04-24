import { type Logger, Response } from "@dieti-estates-2025/common";
import type { LoginPresenter } from "../auth/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { UserNotExistsException, WrongPasswordException } from "../auth/errors.js";

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
        let res: Response;
        if(error instanceof UserNotExistsException || error instanceof WrongPasswordException) {
            res = Response.UNAUTHORIZED;
        } else {
            res = Response.SERVER_ERROR;
            this.logger.error("Uknown error");
        }
        this.responseManager.sendResponse(res);
        this.logger.debug("Error during login. Error response was sent.");
    }
}
