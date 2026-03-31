import type { EventPublisher, Logger } from "../../../common/utilities/src/index.js";
import { BookVisitEvent } from "./events.js";
import type { BookVisitPresenter } from "./interfaces.js";

export class BookVisitInteractor {
    constructor( 
        private publisher: EventPublisher,
        private presenter: BookVisitPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number): boolean {
        this.publisher.publish(new BookVisitEvent(advertisementId));
        // TODO complete implemetation
        throw new Error("implementation incomplete.");
    }   
}
