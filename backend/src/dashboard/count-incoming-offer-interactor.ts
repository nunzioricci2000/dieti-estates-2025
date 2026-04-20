import {
    ValueNotFoundException,
    type Logger,
    type ReaderOf,
    type UpdaterOf,
} from "@dieti-estates-2025/common";
import type { AdvertisementData } from "./data-objects.js";
import { UnavailableAdvertisementDataException } from "./errors.js";

export class CountIncomingOfferInteractor {
    constructor(
        private repository: ReaderOf<
            "AdvertisementData",
            AdvertisementData,
            { id: number }
        > &
            UpdaterOf<"AdvertisementData", AdvertisementData, { id: number }>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisementId: number): Promise<void> {
        let data: AdvertisementData;
        try {
            data = await this.repository.readAdvertisementData({
                id: advertisementId,
            });
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
                this.logger.warn(
                    `Attemped to increment offer count of non existent ad with id: ${advertisementId}`,
                );
                throw new UnavailableAdvertisementDataException();
            } else {
                this.logger.error(`Unexpected error occurred`);
                throw err;
            }
        }
        this.logger.debug(
            `Incremented offer count od advertisement with id: ${advertisementId}`,
        );
        data.offers += 1;
        await this.repository.updateAdvertisementData(
            { id: advertisementId },
            data,
        );
    }
}
