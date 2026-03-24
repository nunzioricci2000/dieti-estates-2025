export {
    type Price,
}

class Price {
    significand: number;
    multiplier: number;

    constructor(significand: number, multiplier: number) {
        this.significand = significand;
        this.multiplier = multiplier;
    }
}
