import { AdvertisementBuilderDirector, type AdvertisementBuilder } from "../entities/advertisement-builder.js";
import { Advertisement, Rental, Sale } from "../entities/advertisement.js";
import { Image } from "../entities/image.js";
import { Price } from "../entities/price.js";
import { Period, RentPrice } from "../entities/rent-price.js";
import { User } from "../entities/user.js";
import { AdvertisementDTO, UserDTO } from "./dto.js";

export { 
    AdvertisementAssembler,
    UserAssembler,
}

class DTOAdvertisementBuilder implements AdvertisementBuilder {
    private partial: Partial<Advertisement> = {};
    private price?: number;
    constructor(
        private dto: AdvertisementDTO,
    ) {}

    setId(): void {
        this.partial.id = this.dto.id;
    }
    setAddress(): void {
        this.partial.address = this.dto.address;
    }
    setCity(): void {
        this.partial.city = this.dto.city;
    }
    setLocation(): void {
        this.partial.location = this.dto.coordinates;
    }
    setDescription(): void {
        this.partial.description = this.dto.description;
    }
    setDimensions(): void {
        this.partial.dimensions = this.dto.dimensions;
    }
    setEnergyClass(): void {
        this.partial.energyClass = this.dto.energyClass;
    }
    setNumberOfRooms(): void {
        this.partial.numberOfRooms = this.dto.numberOfRooms;
    }
    setAdditionalServices(): void {
        this.partial.additionalServices = this.dto.additionalServices;
    }
    setNearbyPOIs(): void {
        this.partial.nearbyPOIs = this.dto.nearbyPOIs;
    }
    setAvailable(): void {
        this.partial.available = false; // NOTE: Availabilty not included in the DTO
    }
    setImages(): void {
        this.partial.images = this.dto.images.map((image: string) => new Image(image));
    }
    setPrice(): void {
        this.price = this.dto.price;
    }
    getResult(): Advertisement {
        const requiredKeys = Object.keys(Advertisement) as (keyof Advertisement)[];
        const isComplete = requiredKeys.every((key) => this.partial[key] !== undefined);
        if(!isComplete) {
            throw new Error("Insufficient data");
        }
        return (this.dto.kind === "sale") ? 
            new Sale(
                this.partial.id!,
                this.partial.address!,
                this.partial.city!,
                this.partial.location!,
                this.partial.images!,
                this.partial.description!,
                this.partial.dimensions!,
                this.partial.numberOfRooms!,
                this.partial.energyClass!,
                this.partial.additionalServices!,
                this.partial.nearbyPOIs!,
                this.partial.available!,
                this.partial.agent!,
                new Price(this.price as number),
            ) :
            new Rental(
                this.partial.id!,
                this.partial.address!,
                this.partial.city!,
                this.partial.location!,
                this.partial.images!,
                this.partial.description!,
                this.partial.dimensions!,
                this.partial.numberOfRooms!,
                this.partial.energyClass!,
                this.partial.additionalServices!,
                this.partial.nearbyPOIs!,
                this.partial.available!,
                this.partial.agent!,
                new RentPrice(this.price as number, Period.Month),
            );
    }
}

class AdvertisementAssembler {
    static createDomainObject(adDTO: AdvertisementDTO): Advertisement {
        const director = new AdvertisementBuilderDirector();
        const builder = new DTOAdvertisementBuilder(adDTO);
        return director.make(builder);
    }

    static createDTO(ad: Advertisement): AdvertisementDTO {
        return new AdvertisementDTO(
            ad.id, ad.address, ad.city, ad.location, ad.images.map((image: Image) => image.url), ad.dimensions, ad.description,
            ad.numberOfRooms, ad.energyClass, ad.additionalServices, ad.nearbyPOIs,
            ad instanceof Sale ? "sale" : "rent", ad instanceof Sale ? ad.price.value : 
            (ad as Rental).rentPrice.price.value
        )
    }
}

class UserAssembler {
    static createDomainObject(userDTO: UserDTO): User {
        return new User(userDTO.email, userDTO.username)
    }

    static createDTO(user: User): UserDTO {
        return new UserDTO(user.username, user.email);
    }
}