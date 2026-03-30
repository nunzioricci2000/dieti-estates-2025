import type { Logger } from "@dieti-estates-2025/utilities";
import type { MakePurchaseOfferPresenter } from "../../user/src/interfaces.js";
import type { ResponseManager } from "./responseManager.js";
import type { Agent } from "@dieti-estates-2025/entities";

export class HTTPMakePurchaseOfferPresenter implements MakePurchaseOfferPresenter {
    constructor(
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    present(agent: Agent): void {
        // TODO implement
    }

    presentError(error: Error): void {
        // TODO IMplement
    }
}