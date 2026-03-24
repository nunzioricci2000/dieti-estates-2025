import { Price } from "./price.js"

export {
    RentPrice,
    Period,
}

class RentPrice {
    price: Price;
    period: Period;

    constructor(value: number, period: Period) {
        this.price = new Price(value);
        this.period = period;
    }
}

enum Period {
    Week,
    Month,
    Year,
}
