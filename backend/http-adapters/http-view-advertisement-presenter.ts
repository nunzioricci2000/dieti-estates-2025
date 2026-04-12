import type { Logger } from "@dieti-estates-2025/utilities";
import type { ViewAdvertisementPresenter } from "../user/src/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { Rental, Sale, type Advertisement } from "@dieti-estates-2025/entities";
import { Response } from "../../common/http-utils/src/response.js";

export class HTTPViewAdvertisementPresenter implements ViewAdvertisementPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(advertisement: Advertisement): void {
        const body = {
            address: advertisement.address,
            city: advertisement.city,
            coordinates: {
                latitude: advertisement.location.latitude,
                longitude: advertisement.location.longitude,
            },
            images: advertisement.images,
            description: advertisement.description,
            dimensions: advertisement.dimensions,
            numberOfRooms: advertisement.numberOfRooms,
            energyClass: advertisement.energyClass,
            additionalServices: advertisement.additionalServices,
            nearbyPOIs: advertisement.nearbyPOIs,
            kind: 
                advertisement instanceof Sale ? "sale" :
                "rent",
            price: advertisement instanceof Sale ? advertisement.price.value:
                (advertisement as Rental).rentPrice.price.value, // TODO review this code
        }
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
