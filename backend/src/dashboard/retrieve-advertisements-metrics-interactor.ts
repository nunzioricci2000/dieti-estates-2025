import type { Logger, ReaderOf } from "@dieti-estates-2025/common";
import type { AdvertisementsMetrics } from "./data-objects.js";
import type { RetrieveAdvertisementsMetricsPresenter } from "./interfaces.js";

export class RetrieveAdvertisementsMetricsInteractor {
    constructor(
        private presenter: RetrieveAdvertisementsMetricsPresenter,
        private metricsRepository: ReaderOf<
            "AdvertisementMetrics",
            AdvertisementsMetrics,
            null
        >,
        private logger: Logger,
    ) {
        logger.info("Created");
    }

    async execute(): Promise<void> {
        let metrics: AdvertisementsMetrics;
        try {
            metrics = await this.metricsRepository.readAdvertisementMetrics();
        } catch (err) {
            this.logger.error("Unexpected error occurred");
            throw err;
        }
        this.presenter.present(metrics);
    }
}
