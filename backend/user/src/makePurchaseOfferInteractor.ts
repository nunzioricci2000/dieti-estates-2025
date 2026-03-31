import type { Price } from "@dieti-estates-2025/entities";
import type { EventPublisher, Logger } from "../../../common/utilities/src/index.js";
import { MakePurchaseOfferEvent } from "./events.js";
import type { MakePurchaseOfferPresenter } from "./interfaces.js";

class MakePurchaseOfferInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: MakePurchaseOfferPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: Price): boolean {
        this.publisher.publish(new MakePurchaseOfferEvent(advertisementId));
        // TODO complete implementation
        throw new Error("Implementation incomplete");
    }
}