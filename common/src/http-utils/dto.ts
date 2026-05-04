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

export class Validator {

    static hasFields(
        obj: any, 
        type: BaseTypes | "array",
        ...fields: string[]): boolean 
    {
        const condition = type === "array" ? (param: any) => !Array.isArray(param)
            : (param: any) => typeof param !== type;
        for(const field of fields) {
            if(obj[field] === undefined || condition(obj[field]) ) {
                return false;
            }
        }
            return true;
    }

    static checkArraysType(type: BaseTypes, ...arrays: any[]) {
        for(const array of arrays) {
            if(!Array.isArray(array)) {
                return false;
            }
            for(const el of array) {
                if(typeof el !== type) return false;
            }
        }
        return true;
    }


    static validateEmail(email: string): boolean {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!email || !regex.test(email)) {
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
        for(const num of params) {
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
    password: string;

    constructor(password: string) {
        this.password = password;
    }

    static fromJSON(json: any): PasswordDTO | undefined {
        if(!Validator.hasFields(json, "string", "password")) {
            return undefined;
        }

        const password: string = json.password;
        if(!Validator.validatePassword(password)) {
            return undefined;
        }
        return new PasswordDTO(password);
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
    username: string;
    email: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }

    static fromJSON(json: any): UserDTO | undefined {
        if(!Validator.hasFields(json, "string", "username", "email")) {
            return undefined;
        }
        const username: string = json.username;
        const email: string = json.email;
        if(!(Validator.validateUsername(username) && Validator.validateEmail(email))) {
            return undefined;
        }
        return new UserDTO(username, email);
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
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    static fromJSON(json: any): AuthResponseDTO | undefined {
        if(!Validator.hasFields(json, "string", "token")) {
            return undefined;
        }
        const token: string = json.token;

        return new AuthResponseDTO(token);
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
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    static fromJSON(json: any): LoginRequestDTO | undefined {
        if(!Validator.hasFields(json, "string", "email", "password")) {
            return undefined;
        }
        const email: string = json.email;
        const password: string = json. password;
        
        if(!(Validator.validateEmail(email) &&
        Validator.validatePassword(password))) {
            return undefined;
        }

        return new LoginRequestDTO(email, password);
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
    username: string;
    email: string;
    password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static fromJSON(json: any): SignUpRequestDTO | undefined {
        if(!Validator.hasFields(json, "string", "username", "email", "password")) {
            return undefined;
        }
        const username: string = json.username;
        const email: string = json.email;
        const password: string = json.password;

        if(!(Validator.validateUsername(username) &&
            Validator.validateEmail(email) &&
            Validator.validatePassword(password))) 
        {
            return undefined;
        }
        return new SignUpRequestDTO(username, email, password);
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
    id: number;
    address: string;
    city: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
    images: string[];
    dimensions: number;
    description: string;
    numberOfRooms: number;
    energyClass: string;
    additionalServices: string[];
    nearbyPOIs: string[];
    kind: AdKinds;
    price: number;

    constructor(id: number, address: string, city: string, coordinates: {latitude: number, longitude: number},
        images: string[], dimensions: number, description: string, numberOfRooms: number, energyClass: string,
        additionalServices: string[], nearbyPOIs: string[], kind: AdKinds, price: number
    ) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.images = images;
        this.dimensions = dimensions;
        this.description = description;
        this.numberOfRooms = numberOfRooms;
        this.energyClass = energyClass;
        this.additionalServices = additionalServices;
        this.nearbyPOIs = nearbyPOIs;
        this.kind = kind;
        this.price = price;
        this.coordinates = coordinates;

    }

    static fromJSON(json: any): AdvertisementDTO | undefined {
        if(!(Validator.hasFields(json, "string", "address", "city", "description", "energyClass", "kind") && 
            Validator.hasFields(json, "number", "dimensions", "numberOfRooms", "price") &&
            Validator.hasFields(json, "array", "images", "additionalServices") &&
            Validator.hasFields(json, "object", "coordinates") &&
            Validator.hasFields(json.coordinates, "number", "latitude", "longitude") &&
            Validator.checkArraysType("string", json.images, json.additionalServices)
        )) {
            return undefined;
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

        const isValid = Validator.validateCoordinates(coordinates) &&
            Validator.validateIntegers(id, numberOfRooms, dimensions, price) &&
            Validator.validateAdKind(kind);

        if(!isValid) {
            return undefined;
        }

        return new AdvertisementDTO(id, address, city, coordinates, images, dimensions,
            description, numberOfRooms, energyClass, additionalServices, nearbyPOIs, kind as AdKinds, price,
        );
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
    private agent: UserDTO;
    private advertisement: AdvertisementDTO;

    constructor(agent: UserDTO, advertisement: AdvertisementDTO) {
        this.agent = agent;
        this.advertisement = advertisement;
    }

    static fromJSON(json: any): SendEmailDTO | undefined {
        const agent = UserDTO.fromJSON(json)
        const advertisement = AdvertisementDTO.fromJSON(json);

        return agent && advertisement && new SendEmailDTO(agent, advertisement);
    }

    toJSON(json?: any): any {
        json = this.agent.toJSON(json);
        this.advertisement.toJSON(json);
        return json;
    }
}

class AdvertisementMetricsDTO {
    private totalVisitsRequested: number;
    private totalViews: number;
    private advertisements: AdvertisementDTO[];

    constructor(totalVisitsRequested: number, totalViews: number, advertisements: AdvertisementDTO[]) {
        this.totalVisitsRequested = totalVisitsRequested;
        this.totalViews = totalViews;
        this.advertisements = advertisements;
    }

    static fromJSON(json: any): AdvertisementMetricsDTO | undefined {
        if(!(Validator.hasFields(json, "number", "totalVisitsRequested", "totalViews")) &&
            Validator.hasFields(json, "array", "advertisements")
        ) {
            return undefined;
        }
        const totalVisitsRequested: number = json.totalVisitsRequested;
        const totalViews: number = json.totalViews;
        if(!(Validator.validateIntegers(totalVisitsRequested, totalViews))) {
            return undefined;
        }
        const ads: AdvertisementDTO[] = [];
        for(const adJSON of json.advertisements) {
            const ad = AdvertisementDTO.fromJSON(json);
            if(ad === undefined) {
                return undefined;
            } else {
                ads.push(ad);
            }
        }
        return new AdvertisementMetricsDTO(totalVisitsRequested, totalViews, ads);
    }

        toJSON(json?: any): any {
        if(!json) {
            json = {};
        }
        json.advertisements = this.advertisements.map((dto) => dto.toJSON());
        json.totalVisitsRequested = this.totalVisitsRequested;
        json.totalViews = this.totalViews;
    }
}
