import { type Logger, Admin, Response } from "@dieti-estates-2025/common";
import type { ResponseManager } from "./response-manager.js";

export class HTTPEditAdminPasswordPresenter {
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
        }
        const headers = new Map<string, string>();


        const res = new Response(
            200,
            body,
            headers,
        )

        this.responseManager.sendResponse(res);
        this.logger.debug("Admin password edited. Success response sent");
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.debug("Failed editing admin password. Error response sent");
    }
}
