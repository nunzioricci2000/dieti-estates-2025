import { Advertisement, Agent} from "@dieti-estates-2025/entities";
import type { FilterAdvertisementsInteractor } from "./filterAdvertisementsInteractor.js";

export interface ViewAdvertisementPresenter {
    present(advertisement: Advertisement): void;
    presentError(error: Error): void;
}

export interface FilterAdvertisementsPresenter {
    present(advertisements: Advertisement[]): void;
    presentError(error: Error): void;
}

export interface AdvertisementReader {
    readAdvertisementById(id: number): Advertisement;
    readAllAdvertisements(): Advertisement[];
    // NOTE: filters type should actually be FilterAdvertisementsInteractor.SearchFilters
    filterAdvertisements(filters: any): Advertisement[];
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