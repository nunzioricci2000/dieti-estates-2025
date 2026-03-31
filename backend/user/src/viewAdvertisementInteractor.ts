import { Advertisement } from "@dieti-estates-2025/entities"
import { ViewAdvertisementEvent } from "./events.js"
import type { ViewAdvertisementPresenter, AdvertisementReader } from "./interfaces.js"
import type { EventPublisher, Logger } from "../../../common/utilities/src/index.js"

export class ViewAdvertisementInteractor {
    constructor(
        private publisher: EventPublisher,
        private presenter: ViewAdvertisementPresenter,
        private reader: AdvertisementReader,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(advertisementId: number): Advertisement {
        this.publisher.publish(new ViewAdvertisementEvent(advertisementId))
        const advertisement = this.reader.readAdvertisementById(advertisementId);
        this.presenter.present(advertisement);
        return advertisement;
    }
}