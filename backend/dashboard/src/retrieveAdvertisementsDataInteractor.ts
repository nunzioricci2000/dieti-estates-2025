import type { Logger } from "../../../common/utilities/src/index.js";
import type { AdvertisementMetricsRepository, AdvertisementRepository, RetrieveAdvertisementsDataPresenter } from "./interfaces.js";

export class RetrieveAdvertisementsDataInteractor {
    constructor(
        private presenter: RetrieveAdvertisementsDataPresenter,
        private adRepository: AdvertisementRepository,
        private metricsRepository: AdvertisementMetricsRepository,
        private logger: Logger,
    ) {
        logger.info("Created");
    }

    execute(): boolean {
        throw new Error("To be implemented");
    }
}