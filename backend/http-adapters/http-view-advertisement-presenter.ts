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
        const body = new Map<string, any>();
        const headers = new Map<string, string>();

        body.set("address", advertisement.address);
        body.set("city", advertisement.city);
        body.set("coordinates", {
            latitude: advertisement.location.latitude,
            longitude: advertisement.location.longitude,
        });
        body.set("images", advertisement.images);
        body.set("description", advertisement.description);
        body.set("dimensions", advertisement.dimensions);
        body.set("numberOfRooms", advertisement.numberOfRooms);
        body.set("energyClass", advertisement.energyClass);
        body.set("additionalServices", advertisement.additionalServices);
        body.set("nearbyPOIs", advertisement.nearbyPOIs);

        if(advertisement instanceof Sale) {
            body.set("kind", "sale");
            body.set("price", advertisement.price.value);
        } else if(advertisement instanceof Rental) {
            body.set("kind", "rent");
            body.set("price", advertisement.rentPrice.price.value);
            body.set("period", advertisement.rentPrice.period);
        }
        
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
