import { Advertisement } from "@dieti-estates-2025/entities"
import { ViewAdvertisementEvent } from "./events.js"
import type { ViewAdvertisementPresenter, AdvertisementReader } from "./interfaces.js"
import type { Logger } from "../../../common/utilities/src/index.js"

export class ViewAdvertisementInteractor {
    constructor(
        private event: ViewAdvertisementEvent,
        private presenter: ViewAdvertisementPresenter,
        private reader: AdvertisementReader,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(id: number): Advertisement {
        const advertisement = this.reader.readAdvertisementById(id);
        this.presenter.present(advertisement);
        this.event.advertisementId = id;
        return advertisement;
    }
}