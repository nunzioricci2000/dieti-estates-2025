import type { Advertisement } from "@dieti-estates-2025/common";
import { ValueNotFoundException, type Logger } from "@dieti-estates-2025/common";
import type { AdvertisementRepository } from "./interfaces.js";
import { UnavailableAdvertisementDataException } from "./errors.js";

class MarkAsTakenInteractor {
    constructor(
        private repository: AdvertisementRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisementId: number): Promise<void> {
        let advertisement: Advertisement;
        try {
            advertisement = await this.repository.readAdvertisement({ id: advertisementId })
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
        await this.repository.updateAdvertisement(advertisement);
    }
}