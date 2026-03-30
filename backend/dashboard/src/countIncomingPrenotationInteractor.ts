import type { Logger } from "../../../common/utilities/src/index.js";
import type { AdvertisementMetricsRepository } from "./interfaces.js";

export class CountIncomingPrenotationInteractor {
    constructor(
        private repository: AdvertisementMetricsRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }
    
    execute(advertisementId: number): void {
        throw new Error("To be implemented");
    }
}