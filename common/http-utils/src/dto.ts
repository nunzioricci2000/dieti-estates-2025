export type {
    SignUpRequestDTO,
    UserDTO,
    LoginRequestDTO,
    AuthResponseDTO,
    PasswordDTO,
    AdvertisementDTO,
    AdvertisementMetricsDTO,
    SendEmailDTO,
}

interface SignUpRequestDTO {
    username: string;
    email: string;
    password: string;
}

interface UserDTO {
    username: string;
    email: string;
}

interface LoginRequestDTO {
    username: string;
    email: string;
}

interface AuthResponseDTO {
    token: string;
}

interface PasswordDTO {
    password: string;
}

interface AdvertisementDTO {
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
    kind: "sale" | "rent";
    price: number;
}

interface AdvertisementMetricsDTO {
    totalVisitsRequested: number;
    totalViews: number;
    advertisements: AdvertisementDTO[];
}

interface SendEmailDTO {
    agent: UserDTO;
    advertisement: AdvertisementDTO;
}
