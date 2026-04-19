export {
    SignUpRequestDTO,
    UserDTO,
    LoginRequestDTO,
    AuthResponseDTO,
    PasswordDTO,
    AdvertisementDTO,
    AdvertisementMetricsDTO,
    SendEmailDTO,
}

type BaseTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
type AdKinds = "sale" | "rent";

class Validator {

    static hasFields(
        obj: any, 
        type: BaseTypes | "array",
        ...fields: string[]): boolean 
    {
        const condition = type === "array" ? (param: any) => Array.isArray(param)
            : (param: any) => typeof param !== type;
        for(const field of fields) {
            if(obj[field] === undefined || condition(obj[field]) ) {
                return false;
            }
        }
            return true;
    }

    static checkArraysType(type: BaseTypes, ...arrays: any[]) {
        for(const array in arrays) {
            for(const el of array) {
                if(typeof el !== type) return false;
            }
        }
        return true;
    }


    static validateEmail(email: string): boolean {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!email || regex.test(email)) {
            return false;
        } 
        return true;
    }

    static validateUsername(username: string): boolean {
        if(!username || username.length < 4) {
            return false;
        }
        return true;
    }

    static validatePassword(password: string): boolean {
        if(!password || password.length < 4) {
            return false;
        }
        return true;
    }

    static validateIntegers(...params: number[]): boolean {
        for(const num in params) {
            if(!Number.isInteger(num)) {
                return false
            }
        }
        return true;
    }

    static validateCoordinates(coord: {latitude: number, longitude: number}): boolean {
        return coord.latitude >= -90 && coord.latitude <= 90 &&
            coord.longitude >= -180 && coord.longitude <= 180;
    }

    static validateAdKind(kind: string) {
        return kind === "sale" || kind === "rent";
    }
}

class PasswordDTO {
    password?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasFields(json, "string", "password")) {
            return false;
        }

        const password: string = json.password;
        if(!Validator.validatePassword(password)) {
            return false;
        }
        this.password = password as string;
        return true;
    }

    toJSON(json?: any): any {
        if(!json) {
            json = {}
        }
        json.password = this.password;
        return json;
    }
}

class UserDTO {
    username?: string;
    email?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasFields(json, "string", "username", "email")) {
            return false;
        }
        const username: string = json.username;
        const email: string = json.email;
        if(!(Validator.validateUsername(username) || Validator.validateEmail(email))) {
            return false;
        }
        this.username = username;
        this.email = email;
        return true;
    }

    toJSON(json?: any): any {
        if(!json) {
            json = {};
        }
        json.username = this.username;
        json.email = this.email;
        return json;
    }
}

class AuthResponseDTO {
    token?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasFields(json, "string", "token")) {
            return false;
        }
        const token: string = json.token;

        this.token = token;
        return true;
    }

    toJSON(json?: any): Response {
        if(!json) {
            json = {};
        }
        json.token = this.token;
        return json;
    }
}

class LoginRequestDTO {
    email?: string;
    password?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasFields(json, "string", "email", "password")) {
            return false;
        }
        const email: string = json.email;
        const password: string = json. password;
        
        if(!(Validator.validateEmail(email) &&
        Validator.validatePassword(password))) {
            return false;
        }

        this.email = json.email;
        this.password = json.password;
        return true;
    }

    toJSON(json?: any): any {
        if(!json) {
            json = {}
        }
        json.email = this.email;
        json.password = this.password;
        return json;
    }
}

class SignUpRequestDTO {
    username?: string;
    email?: string;
    password?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasFields(json, "string", "username", "email", "password")) {
            return false;
        }
        const username: string = json.username;
        const email: string = json.email;
        const password: string = json.password;

        if(!(Validator.validateUsername(username) &&
            Validator.validateEmail(email) &&
            Validator.validatePassword(password))) 
        {
            return false;
        }
        this.username = username;
        this.email = email;
        this.password = password;
        return true;
    }

    toJSON(json: any): any {
        if(!json) {
            json = {}
        }
        json.username = this.username;
        json.email = this.email;
        json.password = this.password;
        return json;
    }

}

class AdvertisementDTO {
    private id?: number;
    private address?: string;
    private city?: string;
    private coordinates?: {
        latitude: number;
        longitude: number;
    }
    private images?: string[];
    private dimensions?: number;
    private description?: string;
    private numberOfRooms?: number;
    private energyClass?: string;
    private additionalServices?: string[];
    private nearbyPOIs?: string[];
    private kind?: AdKinds;
    private price?: number;

    fromJSON(json: any): boolean {
        if(!(Validator.hasFields(json, "string", "address", "city", "description", "energyClass", "kind") && 
            Validator.hasFields(json, "number", "dimensions", "numberOfRooms", "price") &&
            Validator.hasFields(json, "array", "images", "additionalServices") &&
            Validator.hasFields(json, "object", "coordinates") &&
            Validator.hasFields(json.coordinates, "number", "latitude", "longitude") &&
            Validator.checkArraysType("string", json.images, json.additionalServices)
        )) {
            return false
        }

        const id: number = json.id ?? -1;
        const address: string = json.address;
        const city: string = json.city;
        const images: string[] = json.images;
        const dimensions: number = json.dimensions;
        const description: string = json.description;
        const numberOfRooms: number = json.numberOfRooms;
        const energyClass: string = json.energyClass;
        const additionalServices: string[] = json.additionalServices;
        const kind: string = json.kind;
        const price: number = json.price;
        const coordinates = {
            latitude: json.coordinates.latitude,
            longitude: json.coordinates.longitude,
        }

        const nearbyPOIs: string[] = 
            Validator.hasFields(json, "array", "nearbyPOIs") && Validator.checkArraysType("string", json.nearbyPOIs) 
            ? json.nearbyPOIs : []

        let isValid = Validator.validateCoordinates(coordinates) &&
        Validator.validateIntegers(id, numberOfRooms)
        Validator.validateAdKind(kind); // TODO add more validation if necessary

        this.id = id;
        this.address = address;
        this.city = city;
        this.images = images;
        this.dimensions = dimensions;
        this.description = description;
        this.numberOfRooms = numberOfRooms;
        this. energyClass = energyClass;
        this.additionalServices = additionalServices;
        this.nearbyPOIs = nearbyPOIs;
        this.kind = kind as AdKinds;
        this.price = price;
        this.coordinates = coordinates;

        return isValid;
    }


    toJSON(json?: any): any {
        if(!json) {
            json = {}
        }
        json.id = this.id;
        json.address = this.address;
        json.city = this.city;
        json.images = this.images;
        json.dimensions = this.dimensions;
        json.description = this.description;
        json.numberOfRooms = this.numberOfRooms;
        json.energyClass = this.energyClass;
        json.additionalServices = this.additionalServices;
        json.nearbyPOIs = this.nearbyPOIs;
        json.kind = this.kind;
        json.price = this.price;
        json.coordinates = {
            latitude: this.coordinates?.latitude,
            longitude: this.coordinates?.longitude,
        }
        return json;
    }
}

class SendEmailDTO {
    private agent: UserDTO = new UserDTO();
    private advertisement: AdvertisementDTO = new AdvertisementDTO;

    fromJSON(json: any): boolean {
        return this.agent.fromJSON(json) && 
            this.advertisement.fromJSON(json);
    }

    toJSON(json?: any): any {

        json = this.agent.toJSON(json);
        this.advertisement.toJSON(json);
        return json;
    }
}

class AdvertisementMetricsDTO {
    private totalVisitsRequested?: number;
    private totalViews?: number;
    private advertisements: AdvertisementDTO[] = [];

    fromJSON(json: any): boolean {
        if(!(Validator.hasFields(json, "number", "totalVisitsRequested", "totalViews")) &&
            Validator.hasFields(json, "array", "advertisements")
        ) {
            return false;
        }
        const totalVisitsRequested: number = json.totalVisitsRequested;
        const totalViews: number = json.totalViews;
        if(!(Validator.validateIntegers(totalVisitsRequested, totalViews))) {
            return false;
        }
        this.totalVisitsRequested = totalVisitsRequested;
        this.totalViews = totalViews;
        for(const adJSON of json.advertisements) {
            const ad = new AdvertisementDTO();
            if(!ad.fromJSON(adJSON)) {
                return false;
            }
        }
        return true;
    }
}

