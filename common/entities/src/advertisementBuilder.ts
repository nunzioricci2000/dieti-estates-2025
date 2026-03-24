import  { Advertisement } from "./advertisement.js";
import  { Image } from "./image.js";
import { Price } from "./price.js";

interface AdvertisementBuilder<T extends Advertisement> {
    setId(id: number): void;
    setAddress(address: string): void;
    setCity(city: string): void;
    setLocation(location: string): void;
    setImages(images: Image[]): void;
    setAvailable(isAvailable: boolean): void;
    setNearbyPOIs(POIs: string[]): void;
    setAdditionalServices(services: string[]): void;
    setNumberOfRooms(numberOfRooms: number): void;
    setEnergyClass(energyClass: string): void;
    setDimensions(dimensions: number): void;
    setDescription(description: string): void;
    setPrice(price: Price): void;
    getResult(): T;
}
