import type { Logger } from "@dieti-estates-2025/utilities";
import type { BookVisitPresenter } from "../user/src/interfaces.js";
import type { ResponseManager } from "./response-manager.js";
import type { Agent } from "@dieti-estates-2025/entities";

export class HTTPBookVisitPresenter implements BookVisitPresenter {
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
