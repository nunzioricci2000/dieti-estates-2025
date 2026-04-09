import { Event } from "../../../common/utilities/src/index.js";

export {
    ViewAdvertisementEvent,
    MakePurchaseOfferEvent,
    MakeRentOfferEvent,
    BookVisitEvent,
}

class ViewAdvertisementEvent extends Event {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        super();
        this.advertisementId = advertisementId;
    }
}

class MakePurchaseOfferEvent extends Event {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        super();
        this.advertisementId = advertisementId;
    }
}

class MakeRentOfferEvent extends Event {
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