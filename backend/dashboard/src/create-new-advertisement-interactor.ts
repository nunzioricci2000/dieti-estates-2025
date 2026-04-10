import type { Advertisement } from "@dieti-estates-2025/entities";
import type { Logger } from "../../../common/utilities/src/index.js";
import type { AdvertisementRepository, CreateNewAdvertisementPresenter, DetectPOIsService } from "./interfaces.js";

export class CreateNewAdvertisementInteractor {
    constructor(
        private detectPOIsService: DetectPOIsService,
        private presenter: CreateNewAdvertisementPresenter,
        private repository: AdvertisementRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisement: Advertisement): Advertisement {
        const POIs = this.detectPOIsService.detectPOIs(advertisement.location);
        advertisement.nearbyPOIs = POIs;
        const newAd = this.repository.createAdvertisement(advertisement);
        this.presenter.present(newAd);
        this.logger.info("Advertisement created!");
        return newAd;
    }
}