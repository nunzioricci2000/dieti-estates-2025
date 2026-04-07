import type { Advertisement, RentPrice } from "@dieti-estates-2025/entities";
import { ValueNotFoundException, type EventPublisher, type Logger, type ReaderOf } from "../../../common/utilities/src/index.js";
import { MakeRentOfferEvent} from "./events.js";
import type { MakeRentOfferPresenter } from "./interfaces.js";
import { AdvertisementNotExistsException } from "./errors.js";

export class MakeRentOfferInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: MakeRentOfferPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, {id: number}>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number, price: RentPrice): boolean {
        let advertisement: Advertisement;
        try {
            advertisement = this.reader.readAdvertisement({id: advertisementId});
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted rent offer on non existent advertisement with id: ${advertisementId}`);
                this.presenter.presentError(new AdvertisementNotExistsException());
                return false;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.publisher.publish(new MakeRentOfferEvent(advertisementId));
        this.presenter.present(advertisement.agent);
        this.logger.debug(`Added rent offer for advertisement with id ${advertisementId}`);
        return true;
    }
}