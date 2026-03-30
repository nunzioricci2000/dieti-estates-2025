import { Advertisement, Agent} from "@dieti-estates-2025/entities";
import type { SearchFilters } from "./filterAdvertisementsInteractor.js";

export interface ViewAdvertisementPresenter {
    present(advertisement: Advertisement): void;
    presentError(error: Error): void;
}

export interface FilterAdvertisementPresenter {
    present(advertisements: Advertisement[]): void;
    presentError(error: Error): void;
}

export interface AdvertisementReader {
    readAdvertisementById(id: number): Advertisement;
    readAllAdvertisements(): Advertisement[];
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