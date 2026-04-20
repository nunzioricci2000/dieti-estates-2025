import { Advertisement } from "./advertisement.js";

export {
    type AdvertisementBuilder,
    AdvertisementBuilderDirector,
}

interface AdvertisementBuilder<T extends Advertisement> {
    setId(): void;
    setAddress(): void;
    setCity(): void;
    setLocation(): void;
    setDescription(): void;
    setDimensions(): void;
    setEnergyClass(): void;
    setNumberOfRooms(): void;
    setAdditionalServices(): void;
    setNearbyPOIs(): void;
    setAvailable(): void;
    setImages(): void;
    setPrice(): void;
    getResult(): T;
}

class AdvertisementBuilderDirector {
    make<T extends Advertisement>(builder: AdvertisementBuilder<T>): T {
        builder.setId();
        builder.setAddress();
        builder.setCity();
        builder.setLocation();
        builder.setDescription();
        builder.setDimensions();
        builder.setEnergyClass();
        builder.setNumberOfRooms();
        builder.setAdditionalServices();
        builder.setNearbyPOIs();
        builder.setAvailable();
        builder.setImages();
        builder.setPrice();
        return builder.getResult();
    }
}
