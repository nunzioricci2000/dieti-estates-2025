import type { Advertisement } from "@dieti-estates-2025/common";

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
    offers: number;

    constructor(advertisement: Advertisement, visits: number = 0,
        views: number = 0, offers: number = 0,
    ) {
        this.visits = visits;
        this.views = views;
        this.advertisement = advertisement;
        this.offers = offers;
    }
}