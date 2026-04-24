import { type Logger, Admin, Response } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";
import { AdminAlreadySignedException } from "../admin/errors.js";

export class HTTPCreateNewAdminPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(admin: Admin): void {
        const body = {
            username: admin.username,
            email: admin.email,
        };
        const headers = new Map<string, string>();

        const res = new Response(
            200,
            body,
            headers,
        );
        this.responseManager.sendResponse(res);
        this.logger.debug("Admin created, success response sent");
    }

    presentError(error: Error): void {
        let res: Response;
        this.logger.debug("Failed in creating admin. Sending error response");
        if(error instanceof AdminAlreadySignedException) {
            res = Response.CONFLICT;
            return;
        } else {
            res = Response.SERVER_ERROR;
            this.logger.error("Uknown error");
        }
        this.responseManager.sendResponse(res);
    }
}