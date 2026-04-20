import { Advertisement, Rental, Sale } from "../entities/advertisement.js";
import { User } from "../entities/user.js";
import { AdvertisementDTO, UserDTO } from "./dto.js";

export { 
    AdvertisementAssembler,
    UserAssembler,
}

class AdvertisementAssembler {
    static createDomainObject(adDTO: AdvertisementDTO): Advertisement {
        throw new Error("To be implemented");
        // Need a builder to complete
    }

    static createDTO(ad: Advertisement): AdvertisementDTO {
        throw new Error("To be implemented");
        /*
        return new AdvertisementDTO(
            ad.id, ad.address, ad.city, ad.location, ad.images, ad.dimensions, ad.description,
            ad.numberOfRooms, ad.energyClass, ad.additionalServices, ad.nearbyPOIs,
            ad instanceof Sale ? "sale" : "rent", ad instanceof Sale ? ad.price.value : 
            (ad as Rental).rentPrice.price.value
        )
        */
    }
}

class UserAssembler {
    static createDomainObject(userDTO: UserDTO): User {
        // TODO we need to account for all different types of User (Admin and Agent too)
        return new User(userDTO.email, userDTO.username)
    }

    static createDTO(user: User): UserDTO {
        return new UserDTO(user.username, user.email);
    }
}