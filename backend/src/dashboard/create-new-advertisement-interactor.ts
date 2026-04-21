import type { Advertisement } from "@dieti-estates-2025/common";
import type { Logger } from "@dieti-estates-2025/common";
import type {
    AdvertisementRepository,
    CreateNewAdvertisementPresenter,
    DetectPOIsService,
} from "./interfaces.js";

export class CreateNewAdvertisementInteractor {
    constructor(
        private detectPOIsService: DetectPOIsService,
        private presenter: CreateNewAdvertisementPresenter,
        private repository: AdvertisementRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(advertisement: Advertisement): Promise<Advertisement> {
        const POIs = this.detectPOIsService.detectPOIs(advertisement.location);
        advertisement.nearbyPOIs = POIs;
        const newAd = await this.repository.createAdvertisement(advertisement);
        this.presenter.present(newAd);
        this.logger.info("Advertisement created!");
        return newAd;
    }
}
