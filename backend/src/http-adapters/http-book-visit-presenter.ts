import { type Logger, Advertisement, AdvertisementAssembler, Agent, Response, UserAssembler } from "@dieti-estates-2025/common";
import type { BookVisitPresenter } from "../user/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { AdvertisementNotExistsException } from "../user/errors.js";

export class HTTPBookVisitPresenter implements BookVisitPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(advertisement: Advertisement): void {
        const adDTO = AdvertisementAssembler.createDTO(advertisement);
        const agentDTO = UserAssembler.createDTO(advertisement.agent);
        const body = {
            agent: agentDTO.toJSON(),
            advertisement: adDTO.toJSON(),
        }
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
        let res: Response;
        this.logger.debug("Sending error response");
        if(error instanceof AdvertisementNotExistsException) {
            res = Response.NOT_FOUND;
        } else {
            res = Response.SERVER_ERROR;
            this.logger.error("Uknown error");
        }
        this.responseManager.sendResponse(res);
    }
}
