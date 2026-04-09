import { Coordinates } from "./coordinates.js";
import { Price } from "./price.js";
import { RentPrice } from "./rent-price.js";
import { Agent } from "./user.js";
import { Image } from "./image.js";

export {
    Advertisement, 
    Sale, 
    Rental,
}

abstract class Advertisement {
    id: number;
    address: string;
    city: string;
    location: Coordinates;
    images: Image[];
    description: string;
    dimensions: number;
    numberOfRooms: number;
    energyClass: string;
    additionalServices: string[];
    nearbyPOIs: string[];
    available: boolean;
    agent: Agent;

    constructor(id: number, address: string, city: string, location: Coordinates,
        images: Image[], description: string, dimensions: number, 
        numberOfRooms: number, energyClass: string, additionalServices: string[],
        nearbyPOIs: string[], available: boolean, agent: Agent
    ) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.location = location;
        this.images = images;
        this.description = description;
        this.dimensions = dimensions;
        this.numberOfRooms = numberOfRooms;
        this.energyClass = energyClass;
        this.additionalServices = additionalServices;
        this.nearbyPOIs = nearbyPOIs;
        this.available = available;
        this.agent = agent;
    }
}

class Sale extends Advertisement {
    price: Price;

    constructor(id: number, address: string, city: string, location: Coordinates,
        images: Image[], description: string, dimensions: number, 
        numberOfRooms: number, energyClass: string, additionalServices: string[],
        nearbyPOIs: string[], available: boolean, agent: Agent, price: Price
    ) {
        super(id, address, city, location, images, description, dimensions, 
            numberOfRooms, energyClass, additionalServices, nearbyPOIs, available,
            agent
        )
        this.price = price
    }
}

class Rental extends Advertisement {
    rentPrice: RentPrice;

    constructor(id: number, address: string, city: string, location: Coordinates,
        images: Image[], description: string, dimensions: number, 
        numberOfRooms: number, energyClass: string, additionalServices: string[],
        nearbyPOIs: string[], available: boolean, agent: Agent, rentPrice: RentPrice
    ) {
        super(id, address, city, location, images, description, dimensions, 
            numberOfRooms, energyClass, additionalServices, nearbyPOIs, available,
            agent
        )
        this.rentPrice = rentPrice
    }
}
