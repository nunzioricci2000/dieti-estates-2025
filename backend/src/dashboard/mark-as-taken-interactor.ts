import { Advertisement, ValueNotFoundException } from "@dieti-estates-2025/common";
import type { Logger } from "@dieti-estates-2025/common";
import { UnavailableAdvertisementDataException } from "./errors.js";
import type { AdvertisementRepository } from "./interfaces.js";

export class MarkAsTakenInteractor {
    constructor(
        private repository: AdvertisementRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number): void {
        let advertisement: Advertisement;
        try {
            advertisement = this.repository.readAdvertisement({ id: advertisementId })
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to mark non existend ad as taken. Id: ${advertisementId}`);
                throw new UnavailableAdvertisementDataException();
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        advertisement.available = false;
        this.repository.updateAdvertisement(advertisement);
    }
}