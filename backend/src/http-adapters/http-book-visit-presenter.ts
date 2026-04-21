import { type Logger, Agent, Response } from "@dieti-estates-2025/common";
import type { BookVisitPresenter } from "../user/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { UnavailableAdvertisementDataException } from "../dashboard/errors.js";
import { AdvertisementNotExistsException } from "../user/errors.js";

export class HTTPBookVisitPresenter implements BookVisitPresenter {
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
        };
        const headers = new Map<string, string>();

        const res = new Response(
            200,
            body,
            headers,
        );

        this.responseManager.sendResponse(res);
        this.logger.debug("Success response sent");
    }

    presentError(error: Error): void {
        this.logger.debug("Sending error response");
        if(error instanceof AdvertisementNotExistsException) {
            this.responseManager.sendResponse(Response.NOT_FOUND);
            return;
        } else 
        this.responseManager.sendResponse(Response.SERVER_ERROR);
    }
}
