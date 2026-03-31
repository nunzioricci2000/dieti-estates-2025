import { type Coordinates } from "@dieti-estates-2025/entities";
import type { Logger } from "../../../common/utilities/src/index.js";
import type { AdvertisementReader, FilterAdvertisementsPresenter } from "./interfaces.js";

export class FilterAdvertisementsInteractor {
    constructor(
        private reader: AdvertisementReader,
        private presenter: FilterAdvertisementsPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }
    
    public SearchFilters = class {
        area?: string;
        location?: Coordinates;
        distance?: number;
        dimensionsMin?: number;
        dimensionsMax?: number;
        numberOfRoomsMin?: number;
        numberOfRoomsMax?: number;
        acceptableEnergyClasses?: string[];
    }
    
        execute(filters: any): boolean {
            if(!(filters instanceof this.SearchFilters)){
                // TODO consider alternative ways to implement this
                throw new TypeError("Filters must be an instance of SearchFilters");
            }
            const results = this.reader.filterAdvertisements(filters);
            this.presenter.present(results);
            return results.length > 0;
        }
}
