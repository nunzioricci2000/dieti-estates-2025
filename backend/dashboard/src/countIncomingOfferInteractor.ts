import { ValueNotFoundException, type Logger, type RepositoryOf } from "../../../common/utilities/src/index.js";
import type { AdvertisementData } from "./dataObjects.js";
import { UnavailableAdvertisementDataException } from "./errors.js";

export class CountIncomingOfferInteractor {
    constructor(
        private repository: RepositoryOf<"AdvertisementData", AdvertisementData, {id: number}>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }
    
    execute(advertisementId: number): void {
        let data: AdvertisementData;
        try {
            data = this.repository.readAdvertisementData({id: advertisementId});
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attemped to increment offer count of non existent ad with id: ${advertisementId}`);
                throw new UnavailableAdvertisementDataException();
            } else {
                this.logger.error(`Unexpected error occurred`);
                throw err;
            }
        }
        this.logger.debug(`Incremented offer count od advertisement with id: ${advertisementId}`);
        data.offers += 1;
    }
}