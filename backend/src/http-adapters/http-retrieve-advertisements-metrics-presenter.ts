import { AdvertisementAssembler, AdvertisementMetricsDTO, type Logger, Response } from "@dieti-estates-2025/common";
import type { RetrieveAdvertisementsMetricsPresenter } from "../dashboard/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import type { AdvertisementsMetrics } from "../dashboard/data-objects.js";

export class HTTPRetrieveAdvertisementsMetricsPresenter implements RetrieveAdvertisementsMetricsPresenter {
            constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(data: AdvertisementsMetrics): void {
        const dto = new AdvertisementMetricsDTO(
            data.totalVisitRequested, 
            data.totalViews, 
            data.advertisements.map((ad) => AdvertisementAssembler.createDTO(ad)));
        const body = dto.toJSON();
        const headers = new Map<string, string>();

        const res = new Response(200, body, headers);
        this.responseManager.sendResponse(res);
        this.logger.debug("Advertisements Metrics sent");    
    }

    presentError(error: Error): void {
        let res: Response;
        this.logger.debug("Unexpected error");
        res = Response.SERVER_ERROR;
        this.responseManager.sendResponse(res);
    }
    
}