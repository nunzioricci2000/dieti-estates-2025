import { Event } from "../../../common/src/utilities/index.js";

export {
    ViewAdvertisementEvent,
    MakeOfferEvent,
    BookVisitEvent,
}

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