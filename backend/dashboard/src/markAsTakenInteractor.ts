import { ValueNotFoundException, type Logger, type RepositoryOf } from "../../../common/utilities/src/index.js";
import { AdvertisementNotExistsError } from "../../user/src/errors.js";
import type { AdvertisementData } from "./dataObjects.js";

class MarkAsTakenInteractor {
    constructor(
        private repository: RepositoryOf<"AdvertisementData", AdvertisementData, {id: number}>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }
    
    execute(advertisementId: number): void {
        let advertisementData: AdvertisementData;
        try{
            advertisementData = this.repository.readAdvertisementData({id: advertisementId});
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to mark non existend ad as taken. Id: ${advertisementId}`);
                throw new AdvertisementNotExistsError();
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        advertisementData.taken = true;
        this.repository.updateAdvertisementData({id: advertisementId}, advertisementData);
    }
}