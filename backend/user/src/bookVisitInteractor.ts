import type { Logger } from "../../../common/utilities/src/index.js";
import type { BookVisitEvent } from "./events.js";
import type { BookVisitPresenter } from "./interfaces.js";

export class BookVisitInteractor {
    constructor( 
        private event: BookVisitEvent,
        private presenter: BookVisitPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number): boolean {
        // TODO implement
        throw new Error("To be implemented");
    }
}