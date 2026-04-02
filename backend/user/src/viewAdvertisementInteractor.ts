import { Advertisement } from "@dieti-estates-2025/entities"
import { ViewAdvertisementEvent } from "./events.js"
import type { ViewAdvertisementPresenter } from "./interfaces.js"
import { ValueNotFoundException, type EventPublisher, type Logger, type ReaderOf } from "../../../common/utilities/src/index.js"
import { AdvertisementNotExistsException } from "./errors.js";

export class ViewAdvertisementInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: ViewAdvertisementPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, number>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number): Advertisement | null {
        this.publisher.publish(new ViewAdvertisementEvent(advertisementId))
        let advertisement: Advertisement;
        try {
            advertisement = this.reader.readAdvertisement(advertisementId)
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to view non existent advertisement with id: ${advertisementId}`);
                this.presenter.presentError(new AdvertisementNotExistsException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.presenter.present(advertisement);
        this.logger.debug(`Viewed advertisement with id: ${advertisementId}`);
        return advertisement;
    }
}