import { Advertisement, ValueNotFoundException } from "@dieti-estates-2025/common"
import { ViewAdvertisementEvent } from "./events.js"
import type { ViewAdvertisementPresenter } from "./interfaces.js"
import type { EventPublisher, Logger, ReaderOf } from "@dieti-estates-2025/common"
import { AdvertisementNotExistsException } from "./errors.js";

export class ViewAdvertisementInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: ViewAdvertisementPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, { id: number }>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisementId: number): Promise<Advertisement | null> {
        this.publisher.publish(new ViewAdvertisementEvent(advertisementId))
        let advertisement: Advertisement;
        try {
            advertisement = await this.reader.readAdvertisement({ id: advertisementId })
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
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