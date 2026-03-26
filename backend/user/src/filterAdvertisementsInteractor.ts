import { Advertisement, type Coordinates } from "@dieti-estates-2025/entities";
import type { Logger } from "../../../common/utilities/src/index.js";
import type { AdvertisementReader, FilterAdvertisementPresenter } from "./interfaces.js";

export class FilterAdvertisementInteractor {
    constructor(
        private reader: AdvertisementReader,
        private presenter: FilterAdvertisementPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(filters: SearchFilters): boolean {
        const results = this.reader.filterAdvertisements(filters);
        this.presenter.present(results);
        return results.length > 0;
    }
}

export class SearchFilters {
    area?: string;
    location?: Coordinates;
    distance?: number;
    dimensionsMin?: number;
    dimensionsMax?: number;
    numberOfRoomsMin?: number;
    numberOfRoomsMax?: number;
    acceptableEnergyClasses?: string[];
}