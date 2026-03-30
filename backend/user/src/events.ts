export {
    ViewAdvertisementEvent,
    MakePurchaseOfferEvent,
    MakeRentOfferEvent,
    BookVisitEvent,
}

class ViewAdvertisementEvent {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        this.advertisementId = advertisementId;
    }
}

class MakePurchaseOfferEvent {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        this.advertisementId = advertisementId;
    }
}

class MakeRentOfferEvent {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        this.advertisementId = advertisementId;
    }
}

class BookVisitEvent {
    advertisementId: number;
    
    constructor(advertisementId: number) {
        this.advertisementId = advertisementId;
    }
}