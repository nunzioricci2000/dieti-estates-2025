import type { Logger } from "@dieti-estates-2025/utilities";
import type { FilterAdvertisementsPresenter } from "../user/src/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { Rental, Sale, type Advertisement } from "@dieti-estates-2025/entities";
import type { AdvertisementDTO } from "../../common/http-utils/src/dto.js";
import { Response } from "../../common/http-utils/src/response.js";

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
            body.push({
                id: ad.id,
                address: ad.address,
                city: ad.city,
                coordinates: {
                    latitude: ad.location.latitude,
                    longitude: ad.location.longitude,
                },
                images: ad.images.map(image => image.url),
                dimensions: ad.dimensions,
                description: ad.description,
                numberOfRooms: ad.numberOfRooms,
                energyClass: ad.energyClass,
                additionalServices: ad.additionalServices,
                nearbyPOIs: ad.nearbyPOIs,
                kind: ad instanceof Sale ? "sale" :
                    "rent",
                price: ad instanceof Sale ? ad.price.value :
                    (ad as Rental).rentPrice.price.value,
            })
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
