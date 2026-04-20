import type { Advertisement, Coordinates } from "@dieti-estates-2025/common";
import { AdvertisementsMetrics } from "./data-objects.js";
import type { RepositoryOf } from "@dieti-estates-2025/common";

export interface DetectPOIsService {
    detectPOIs(location: Coordinates): string[];
}

export interface CreateNewAdvertisementPresenter {
    present(advertisement: Advertisement): void;
    presentError(error: Error): void;
}

export interface RetrieveAdvertisementsMetricsPresenter {
    present(data: AdvertisementsMetrics): void;
    presentError(error: Error): void;
}

export interface AdvertisementRepository extends RepositoryOf<"Advertisement", Advertisement, { id: number }> {
    readAllAdvertisements(): Advertisement[];
}