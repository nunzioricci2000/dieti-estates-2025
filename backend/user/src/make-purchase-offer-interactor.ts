import type { Advertisement, Price } from "@dieti-estates-2025/entities";
import { ValueNotFoundException, type EventPublisher, type Logger, type ReaderOf } from "../../../common/utilities/src/index.js";
import { MakePurchaseOfferEvent } from "./events.js";
import type { MakePurchaseOfferPresenter } from "./interfaces.js";
import { AdvertisementNotExistsException } from "./errors.js";

export class MakePurchaseOfferInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: MakePurchaseOfferPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, {id: number}>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: Price): boolean {
        let advertisement: Advertisement
        try {
            advertisement = this.reader.readAdvertisement({id: advertisementId});
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to perform purchase offer of non existend advertisement with id: ${advertisementId}`);
                this.presenter.presentError(new AdvertisementNotExistsException());
                return false;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.publisher.publish(new MakePurchaseOfferEvent(advertisementId));
        this.presenter.present(advertisement.agent);
        this.logger.debug(`Performed offer for advertisement with id ${advertisementId}`);
        return true;
    }
}