import type { Price } from "@dieti-estates-2025/entities";
import type { Logger } from "../../../common/utilities/src/index.js";
import type { MakePurchaseOfferEvent } from "./events.js";
import type { MakePurchaseOfferPresenter } from "./interfaces.js";

class MakePurchaseOfferInteractor {
    constructor(
        private event: MakePurchaseOfferEvent,
        private presenter: MakePurchaseOfferPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: Price): boolean {
        // TODO implement
        throw new Error("To be implemented");
    }
}