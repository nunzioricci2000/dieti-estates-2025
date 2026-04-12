import type { Logger } from "@dieti-estates-2025/utilities";
import type { MakeOfferPresenter } from "../user/src/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import type { Agent } from "@dieti-estates-2025/entities";
import { Response } from "../../common/http-utils/src/response.js";
import type { UserDTO } from "../../common/http-utils/src/dto.js";

export class HTTPMakeOfferPresenter implements MakeOfferPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(agent: Agent): void {
        const body: UserDTO = {
            username: agent.username,
            email: agent.email,
        };
        const headers = new Map<string, string>();
        
        const res = new Response(
            200,
            body,
            headers,
        )

        this.responseManager.sendResponse(res);
        this.logger.debug("Success response sent");
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.debug("Error response sent");
    }
}
