import type { Advertisement, Coordinates } from "@dieti-estates-2025/entities";
import { AdvertisementsMetrics, AdvertisementData } from "./dataObjects.js";

export interface DetectPOIsService {
    detectPOIs(location: Coordinates): string[];
}

export interface CreateNewAdvertisementPresenter {
    present(advertisement: Advertisement): void;
    presentError(error: Error): void;
}

export interface AdvertisementRepository {
    readAdvertisementById(id: number): Advertisement;
    readAllAdvertisements(): Advertisement[];
    createAdvertisement(advertisement: Advertisement): Advertisement;
    updateAdvertisement(advertisement: Advertisement): Advertisement;
}

export interface RetrieveAdvertisementsDataPresenter {
    present(data: AdvertisementData): void;
    presentError(error: Error): void;
}

export interface AdvertisementMetricsRepository {
    getAdvertisementsMetrics(): AdvertisementsMetrics;
    increaseOfferCounter(id: number): void;
    increaseViewCounter(id: number): void;
    increasePrenotationCounter(id: number): void;
    markAsTaken(id: number): void;
}