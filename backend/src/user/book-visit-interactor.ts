import type { Advertisement } from "@dieti-estates-2025/common";
import {
    ValueNotFoundException,
    type EventPublisher,
    type Logger,
    type ReaderOf,
} from "@dieti-estates-2025/common";
import { BookVisitEvent } from "./events.js";
import type { BookVisitPresenter } from "./interfaces.js";
import { AdvertisementNotExistsException } from "./errors.js";

export class BookVisitInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: BookVisitPresenter,
        private reader: ReaderOf<"Advertisement", Advertisement, number>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisementId: number): Promise<boolean> {
        let advertisement: Advertisement;
        try {
            advertisement =
                await this.reader.readAdvertisement(advertisementId);
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
                this.logger.warn(
                    `Attempted to book visit for non existent advertisement with id: ${advertisementId}`,
                );
                this.presenter.presentError(
                    new AdvertisementNotExistsException(),
                );
                return false;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.publisher.publish(new BookVisitEvent(advertisementId));
        this.presenter.present(advertisement.agent);
        this.logger.debug(
            `Booked visit for advertisement with id: ${advertisementId}`,
        );
        return true;
    }
}
