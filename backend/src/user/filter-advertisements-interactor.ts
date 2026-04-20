import { Advertisement, type Coordinates } from "@dieti-estates-2025/common";
import type { Logger } from "../../../common/src/utilities/index.js";
import type { AdvertisementReader, FilterAdvertisementsPresenter } from "./interfaces.js";

export class FilterAdvertisementsInteractor {
    constructor(
        private reader: AdvertisementReader,
        private presenter: FilterAdvertisementsPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(filters: SearchFilters): boolean {
        let results: Advertisement[];
        try {
            results = this.reader.filterAdvertisements(filters);
        } catch (err) {
            this.logger.error("UnexpectedErrorOccurred");
            throw err;
        }
        this.presenter.present(results);
        return results.length > 0;
    }
}

export interface SearchFilters {
    area?: string;
    location?: Coordinates;
    distance?: number;
    dimensionsMin?: number;
    dimensionsMax?: number;
    numberOfRoomsMin?: number;
    numberOfRoomsMax?: number;
    acceptableEnergyClasses?: string[];
}