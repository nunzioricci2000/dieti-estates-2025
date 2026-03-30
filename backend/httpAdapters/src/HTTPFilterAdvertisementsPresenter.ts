import type { Logger } from "@dieti-estates-2025/utilities";
import type { FilterAdvertisementsPresenter } from "../../user/src/interfaces.js";
import type { ResponseManager } from "./responseManager.js";
import type { Advertisement } from "@dieti-estates-2025/entities";

export class HTTPFilterAdvertisementsPresenter implements FilterAdvertisementsPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(advertisement: Advertisement[]): void {
        // TODO implement
    }

    presentError(error: Error): void {
        // TODO IMplement
    }
}