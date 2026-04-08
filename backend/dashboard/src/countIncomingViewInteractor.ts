import { ValueNotFoundException, type Logger, type RepositoryOf } from "../../../common/utilities/src/index.js";
import type { AdvertisementData } from "./dataObjects.js";
import { UnavailableAdvertisementDataException } from "./errors.js";

class CountIncomingViewInteractor {
    constructor(
        private repository: RepositoryOf<"AdvertisementData", AdvertisementData, number>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }
    
    execute(advertisementId: number): void {
        let data: AdvertisementData;
        try {
            data = this.repository.readAdvertisementData(advertisementId);
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attemped to increment view count of non existent ad with id: ${advertisementId}`);
                throw new UnavailableAdvertisementDataException();
            } else {
                this.logger.error(`Unexpected error occurred`);
                throw err;
            }
        }
        this.logger.debug(`Incremented view count od advertisement with id: ${advertisementId}`);
        data.views += 1;
        this.repository.updateAdvertisementData(advertisementId, data);
    }
}