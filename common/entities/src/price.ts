export {
    Price,
}

class Price {
    value: number;

    constructor(value: number) {
        if (!Number.isInteger(value)) {
            throw new TypeError("The value must be an integer");
        }
        this.value = value;
    }
}
