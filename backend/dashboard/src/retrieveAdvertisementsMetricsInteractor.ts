import type { Logger, RepositoryOf } from "@dieti-estates-2025/utilities";
import type { AdvertisementsMetrics } from "./dataObjects.js";
import type { RetrieveAdvertisementsMetricsPresenter } from "./interfaces.js";

export class RetrieveAdvertisementsMetricsInteractor {
    constructor(
        private presenter: RetrieveAdvertisementsMetricsPresenter,
        private metricsRepository: RepositoryOf<"AdvertisementMetrics", AdvertisementsMetrics, null>,
        private logger: Logger,
    ) {
        logger.info("Created");
    }

    execute(): void {
        let metrics: AdvertisementsMetrics;
        try {
            metrics = this.metricsRepository.readAdvertisementMetrics(null);
        } catch(err) {
            this.logger.error("Unexpected error occurred");
            throw err;
        }
        this.presenter.present(metrics);
    }
}