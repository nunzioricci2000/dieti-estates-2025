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

    execute(advertisement: Advertisement): number {
        // TODO we cannot create a full instance of Advertisement before we know its id. 
        // It may not be a good parameter
        throw new Error("To be implemented");
    }
}