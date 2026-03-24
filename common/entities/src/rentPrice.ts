export {
    type RentPrice,
    type Period,
}

class RentPrice {
    significand: number;
    multiplier: number;
    period: Period;

    constructor(significand: number, multiplier: number, period: Period) {
        this.significand = significand;
        this.multiplier = multiplier;
        this.period = period
    }
}

enum Period {
    Week,
    Month,
    Year,
}
