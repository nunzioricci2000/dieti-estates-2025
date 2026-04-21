import { type Logger, Rental, Sale, Advertisement, Response } from "@dieti-estates-2025/common";
import type { ViewAdvertisementPresenter } from "../user/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import { AdvertisementNotExistsException } from "../user/errors.js";

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
        let res: Response;
        if(error instanceof AdvertisementNotExistsException) {
            res = Response.NOT_FOUND;
        } else {
            res = Response.SERVER_ERROR;
        }
        this.responseManager.sendResponse(res);
        this.logger.debug("Error response sent");
    }
}
