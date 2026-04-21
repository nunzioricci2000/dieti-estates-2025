import type { Advertisement, EventPublisher, Logger, ReaderOf } from "@dieti-estates-2025/common";
import { ValueNotFoundException } from "@dieti-estates-2025/common";
import { MakeOfferEvent } from "./events.js";
import type { MakeOfferPresenter } from "./interfaces.js";
import { AdvertisementNotExistsException } from "./errors.js";

export class MakeOfferInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: MakeOfferPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, { id: number }>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisementId: number): Promise<boolean> {
        let advertisement: Advertisement
        try {
            advertisement = await this.reader.readAdvertisement({ id: advertisementId });
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to propose offer of non existend advertisement with id: ${advertisementId}`);
                this.presenter.presentError(new AdvertisementNotExistsException());
                return false;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.publisher.publish(new MakeOfferEvent(advertisementId));
        this.presenter.present(advertisement.agent);
        this.logger.debug(`Added offer for advertisement with id ${advertisementId}`);
        return true;
    }
}