import { type Logger, Rental, Sale, Advertisement, AdvertisementDTO, Response, AdvertisementAssembler } from "@dieti-estates-2025/common";
import type { FilterAdvertisementsPresenter } from "../user/interfaces.js";
import type { ResponseManager } from "./response-manager.js";

export class HTTPFilterAdvertisementsPresenter implements FilterAdvertisementsPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(advertisements: Advertisement[]): void {
        const body: AdvertisementDTO[] = [];
        for (const ad of advertisements) {
            body.push(AdvertisementAssembler.createDTO(ad));
        }

        const headers = new Map<string, string>();

        const res = new Response(
            200,
            body,
            headers,
        )

        this.responseManager.sendResponse(res);
    }

    presentError(error: Error): void {
        this.responseManager.sendError(error);
        this.logger.error("Error!");
    }
}
