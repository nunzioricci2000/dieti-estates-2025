import type { Logger } from "@dieti-estates-2025/utilities";
import type { ResponseManager } from "./response-manager.js";
import type { Admin } from "@dieti-estates-2025/entities";
import { Response } from "./response.js";

export class HTTPEditAdminPasswordPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(admin: Admin): void {
        const body = new Map<string, any>();
        const headers = new Map<string, string>();

        body.set("username", admin.username);
        body.set("email", admin.email);

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
