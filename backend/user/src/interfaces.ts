import { Advertisement, Agent} from "@dieti-estates-2025/entities";
import type { FilterAdvertisementsInteractor, SearchFilters } from "./filter-advertisements-interactor.js";
import type { ReaderOf } from "@dieti-estates-2025/utilities";

export interface ViewAdvertisementPresenter {
    present(advertisement: Advertisement): void;
    presentError(error: Error): void;
}

export interface FilterAdvertisementsPresenter {
    present(advertisements: Advertisement[]): void;
    presentError(error: Error): void;
}

export interface AdvertisementReader extends ReaderOf<"Advertisement", Advertisement, {id: number}> {
    filterAdvertisements(filters: SearchFilters): Advertisement[];
}

export interface MakePurchaseOfferPresenter {
    present(agent: Agent): void;
    presentError(error: Error): void;
}

export interface MakeRentOfferPresenter {
    present(agent: Agent): void;
    presentError(error: Error): void;
}

export interface BookVisitPresenter {
    present(agent: Agent): void;
    presentError(error: Error): void;
}