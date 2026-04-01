import type { Advertisement } from "@dieti-estates-2025/entities";

export {
    AdvertisementsMetrics,
    AdvertisementData,
}

class AdvertisementsMetrics {
    totalVisitRequested: number;
    totalViews: number;
    advertisements: Advertisement[];

    constructor(visits: number, views: number, advertisements: Advertisement[]) {
        this.totalVisitRequested = visits;
        this.totalViews = views;
        this.advertisements = advertisements;
    }
}

class AdvertisementData {
    advertisement: Advertisement;
    views: number;
    visits: number;

    constructor(visits: number, views: number, advertisement: Advertisement) {
        this.visits = visits;
        this.views = views;
        this.advertisement = advertisement;
    }
}