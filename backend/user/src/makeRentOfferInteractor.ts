import type { RentPrice } from "@dieti-estates-2025/entities";
import type { Logger } from "../../../common/utilities/src/index.js";
import type { MakePurchaseOfferEvent } from "./events.js";
import type { MakeRentOfferPresenter } from "./interfaces.js";

export class MakeRentOfferInteractor {
    constructor(
        private event: MakePurchaseOfferEvent,
        private presenter: MakeRentOfferPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: RentPrice) {
        //TODO imlement
        throw new Error("To be implemented");
    }
}