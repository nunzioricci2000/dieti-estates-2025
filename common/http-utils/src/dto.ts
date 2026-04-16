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

class Validator {

    static hasStringFields(obj: any, ...fields: string[]): boolean {
        for(const field in fields) {
            if(obj[field] === undefined || !(typeof obj[field] === "string")) {
                return false;
            }
        }
        return true;
    }

    static hasNumberFields(obj: any, ...fields: string[]): boolean {
        for(const field in fields) {
            if(obj[field] === undefined || !(typeof obj[field] !== "number")) {
                return false;
            }
        }
        return true;
    }

    static validateEmail(email: string): boolean {
        // TODO: insert proper validation conditions for email
        if(!email || email.length < 4) {
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

    static validateToken(token: string): boolean {
        // TODO: insert proper validation conditions for token
        if(!token) {
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
}

class PasswordDTO {
    password?: string;

    fromJSON(json: any): boolean {
        if(!Validator.hasStringFields(json, "password")) {
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
        if(!Validator.hasStringFields(json, "username", "email")) {
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
        if(!Validator.hasStringFields(json, "token")) {
            return false;
        }
        const token: string = json.token;
        if(!Validator.validateToken(token)) {
            return false;
        }
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
        if(!Validator.hasStringFields(json, "email", "password")) {
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
        if(!Validator.hasStringFields(json, "username", "email", "password")) {
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
    private kind?: "sale" | "rent";
    private price?: number;

    fromJSON(json: any): boolean {
        if(!(Validator.hasStringFields(json, "address", "city", "description", "energyClass", "kind") && 
            Validator.hasNumberFields(json, "dimensions", "numberOfRooms", "price"))
            //TODO complete check with array fields
        ) {
            return false
        }

        this.id = json.id ?? -1;
        this.address = json.address;
        this.city = json.city;
        this.images = json.images;
        this.dimensions = json.dimensions;
        this.description = json.description;
        this.numberOfRooms = json.numberOfRooms;
        this.energyClass = json.energyClass;
        this.additionalServices = json.additionalServices;
        this.nearbyPOIs = json.nearbyPOIs;
        this.kind = json.kind;
        this.price = json.price;
        this.coordinates = {
            latitude: json.coordinates?.latitude,
            longitude: json.coordinates?.longitude,
        }

        let isValid = true;
        return true;
        //TODO insert validation
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
        if(!(Validator.hasNumberFields(json, "totalVisitsRequested", "totalViews"))) {
            //TODO ccomplete check with array field
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

