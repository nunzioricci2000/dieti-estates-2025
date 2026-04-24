import { Event } from "@dieti-estates-2025/common";

export { ViewAdvertisementEvent, MakeOfferEvent, BookVisitEvent };

class ViewAdvertisementEvent extends Event {
    advertisementId: number;

    constructor(advertisementId: number) {
        super();
        this.advertisementId = advertisementId;
    }
}

class MakeOfferEvent extends Event {
    advertisementId: number;

    constructor(advertisementId: number) {
        super();
        this.advertisementId = advertisementId;
    }
}

class BookVisitEvent extends Event {
    advertisementId: number;

    constructor(advertisementId: number) {
        super();
        this.advertisementId = advertisementId;
    }
}
