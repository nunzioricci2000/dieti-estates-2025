import type { RentPrice } from "@dieti-estates-2025/entities";
import type { EventPublisher, Logger } from "../../../common/utilities/src/index.js";
import { MakeRentOfferEvent} from "./events.js";
import type { MakeRentOfferPresenter } from "./interfaces.js";

export class MakeRentOfferInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: MakeRentOfferPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: RentPrice) {
        this.publisher.publish(new MakeRentOfferEvent(advertisementId));
        //TODO complete implementation
        throw new Error("Implementation incomplete");
    }
}