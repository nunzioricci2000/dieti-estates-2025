export { Coordinates };

class Coordinates {
    latitude: number;
    longitude: number;

    constructor(latitude: number, longitude: number) {
        if (!Number.isFinite(latitude)) {
            throw new TypeError("Latitude must be a finite number");
        }
        if (latitude < -90 || latitude > 90) {
            throw new RangeError("Latitude must be within -90 and 90");
        }

        if (!Number.isFinite(longitude)) {
            throw new TypeError("Longitude must be a finite number");
        }
        if (longitude < -180 || longitude > 180) {
            throw new RangeError("Longitude must be within -180 and 180");
        }

        this.latitude = latitude;
        this.longitude = longitude;
    }
}
