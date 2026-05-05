import { AdvertisementAssembler, type Advertisement, type Logger, Response } from "@dieti-estates-2025/common";
import type { CreateNewAdvertisementPresenter } from "../dashboard/interfaces.js";
import type { ResponseManager } from "./response-manager.js";

export class HTTPCreateNewAdvertisementPresenter implements CreateNewAdvertisementPresenter {
        constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(advertisement: Advertisement): void {
        const dto = AdvertisementAssembler.createDTO(advertisement);
        const body = dto.toJSON();
        const headers = new Map<string, string>();

        const res = new Response(200, body, headers);
        this.responseManager.sendResponse(res);
        this.logger.debug("Advertisement created, success response sent");    
    }

    presentError(error: Error): void {
        let res: Response;
        this.logger.debug("Failed in creating admin. Sending error response");
        res = Response.SERVER_ERROR;
        this.responseManager.sendResponse(res);
    }
    
}