import  { Advertisement, Sale, Rental } from "./advertisement.js";
import  { Image } from "./image.js";
import { Coordinates } from "./coordinates.js";
import { Price } from "./price.js";
import { Period, RentPrice } from "./rentPrice.js";

interface AdvertisementBuilder {
    setId(id: number): void;
    setAddress(address: string): void;
    setCity(city: string): void;
    setLocation(latitude: number, longitude: number): void;
    setImages(images: Image[]): void;
    setAvailable(isAvailable: boolean): void;
    setNearbyPOIs(POIs: string[]): void;
    setAdditionalServices(services: string[]): void;
    setNumberOfRooms(numberOfRooms: number): void;
    setEnergyClass(energyClass: string): void;
    setDimensions(dimensions: number): void;
    setDescription(description: string): void;
}

abstract class BaseAdvertisementBuilder<T extends Advertisement> implements AdvertisementBuilder {
    advertisement: Partial<T> = {};

    setId(id: number): void {
        this.advertisement.id = id;
    }

    setAddress(address: string): void {
        this.advertisement.address = address;
    }

    setCity(city: string): void {
        this.advertisement.city = city;
    }

    setLocation(latitude: number, longitude: number): void {
        this.advertisement.location = new Coordinates(latitude, longitude);
    }

    setImages(images: Image[]) {
        this.advertisement.images = images;
    }

    setAvailable(isAvailable: boolean): void {
        this.advertisement.available = isAvailable;
    }

    setNearbyPOIs(POIs: string[]): void {
        this.advertisement.nearbyPOIs = POIs;
    }

    setAdditionalServices(services: string[]): void {
        this.advertisement.additionalServices = services;
    }
    
    setNumberOfRooms(numberOfRooms: number): void {
        this.advertisement.numberOfRooms = numberOfRooms;
    }
    
    setEnergyClass(energyClass: string): void {
        this.advertisement.energyClass = energyClass;
    }

    setDimensions(dimensions: number): void {
        this.advertisement.dimensions = dimensions;
    }

    setDescription(description: string): void {
        this.advertisement.description = description;
    }
}

class SaleBuilder extends BaseAdvertisementBuilder<Sale> {
    setPrice(value: number): void {
        this.advertisement.price = new Price(value);
    }

    getResult(): Sale {
        const ad = this.advertisement;
        if(!ad.id || !ad.address || !ad.city || !ad.location || !ad.available || 
            !ad.numberOfRooms || !ad.energyClass || !ad.dimensions || !ad.price ||
            !ad.agent
        ) {
            throw new Error("You must set all required field before extracting result product.");
        }

        return new Sale(ad.id, ad.address, ad.city, ad.location, ad.images ?? [], 
            ad.description ?? "", ad.dimensions, ad.numberOfRooms, ad.energyClass, 
            ad.additionalServices ?? [], ad.nearbyPOIs ?? [], ad.available, ad.agent, ad.price
        )
    }
}

class RentalBuilder extends BaseAdvertisementBuilder<Rental> {
    setRentPrice(value: number, period: Period) {
        this.advertisement.rentPrice = new RentPrice(value, period);
    }

    getResult(): Rental {
        const ad = this.advertisement;
        if(!ad.id || !ad.address || !ad.city || !ad.location || !ad.available || 
            !ad.numberOfRooms || !ad.energyClass || !ad.dimensions || !ad.rentPrice ||
            !ad.agent
        ) {
            throw new Error("You must set all required field before extracting result product.");
        }

        return new Rental(ad.id, ad.address, ad.city, ad.location, ad.images ?? [], 
            ad.description ?? "", ad.dimensions, ad.numberOfRooms, ad.energyClass, 
            ad.additionalServices ?? [], ad.nearbyPOIs ?? [], ad.available, ad.agent, ad.rentPrice
        )
    }
}