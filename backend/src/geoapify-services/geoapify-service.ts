import type { Coordinates } from "@dieti-estates-2025/common";
import type { DetectPOIsService } from "../dashboard/interfaces.js";

export class GeoapifyService implements DetectPOIsService {
    private apiKey = process.env.GEOAPIFY_API_KEY;
    private radius = 2000;
    private limit = 20;
    private filters = [
        "public_transport.bus",
        "public_transport.train",
        "public_transport.subway",
        "public_transport.tram",
        "railway.train",
        "airport",
        "highway.motorway",
        "highway.primary",
        "education.school",
        "education.kindergarten",
        "education.university",
        "education.library",
        "childcare.kindergarten",
        "healthcare.hospital",
        "healthcare.clinic_or_praxis.general",
        "healthcare.pharmacy",
        "healthcare.dentist",
        "service.police",
        "service.fire_station",
        "commercial.supermarket",
        "commercial.convenience",
        "service.financial.bank",
        "service.financial.atm",
        "service.post.office",
        "catering.restaurant",
        "catering.cafe",
        "catering.bar",
        "catering.fast_food",
        "leisure.park",
        "leisure.park.garden",
        "leisure.playground",
        "natural",
        "beach",
        "sport.fitness.fitness_centre",
        "sport.sports_centre",
        "sport.swimming_pool",
        "leisure.spa",
        "commercial.shopping_mall",
        "commercial.department_store",
        "commercial.marketplace",
        "commercial.food_and_drink",
        "parking",
        "service.vehicle.fuel",
        "service.vehicle.charging_station",
        "service.vehicle.repair",
        "office.government",
        "service.social_facility",
        "entertainment.cinema",
        "entertainment.culture.theatre",
        "entertainment.museum",
        "tourism.attraction"
    ]

    async detectPOIs(location: Coordinates): Promise<string[]> {
        var fetch = require('node-fetch');
        var requestOptions = {
            method: 'GET',
        };
        const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=` +
            `${this.filters.join(",")}`+ 
            `service,natural,pet&filter=circle:${location.latitude},${location.longitude},${this.radius}` + `
            &bias=proximity:${location.latitude},${location.longitude}&limit=${this.limit}&apiKey=${this.apiKey}`,
            requestOptions
        ).then((response: Response) => response.json());
        // response is expected to have the array features
        const set = new Set<string>();
        for(const feature of response.features) {
            const categoryString = feature.properties.categories[1] as string;
            const categories = categoryString.split(".");
            set.add(categories[1]!);
        }
        const result: string[] = []
        for(const value of set) {
            result.push(value);
        }
        return result;
    }
}