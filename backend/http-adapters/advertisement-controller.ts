import type { Logger } from "@dieti-estates-2025/utilities";
import type { Request } from "../../common/http-utils/src/request.js";
import type { ViewAdvertisementInteractor } from "../user/src/view-advertisement-interactor.js";
import type { FilterAdvertisementsInteractor } from "../user/src/filter-advertisements-interactor.js";
import type { MakePurchaseOfferInteractor } from "../user/src/make-purchase-offer-interactor.js";
import type { MakeRentOfferInteractor } from "../user/src/make-rent-offer-interactor.js";
import type { BookVisitInteractor } from "../user/src/book-visit-interactor.js";
import type { CreateNewAdvertisementInteractor } from "../dashboard/src/create-new-advertisement-interactor.js";
import type { RetrieveAdvertisementsMetricsInteractor } from "../dashboard/src/retrieve-advertisements-metrics-interactor.js";
import type { CountIncomingOfferInteractor } from "../dashboard/src/count-incoming-offer-interactor.js";
import type { CountIncomingViewInteractor } from "../dashboard/src/count-incoming-view-interactor.js";
import type { MarkAsTakenInteractor } from "../dashboard/src/mark-as-taken-interactor.js";
import type { CountIncomingPrenotationInteractor } from "../dashboard/src/count-incoming-prenotation-interactor.js";

export class Advertisement {
    constructor(
        private viewAdvertisementInteractor: ViewAdvertisementInteractor,
        private filterAdvertisementInteractor: FilterAdvertisementsInteractor,
        private makePurchaseInteractor: MakePurchaseOfferInteractor,
        private makeRentOfferInteractor: MakeRentOfferInteractor,
        private bookVisitInteractor: BookVisitInteractor,
        private createNewAdvertisementInteractor: CreateNewAdvertisementInteractor,
        private retrieveAdvertisementsMetricsInteractor: RetrieveAdvertisementsMetricsInteractor,
        private countIncomingOfferInteractor: CountIncomingOfferInteractor,
        private countIncomingViewInteractor: CountIncomingViewInteractor,
        private markAsTakenInteractor: MarkAsTakenInteractor,
        private countIncomingPrenotationInteractor: CountIncomingPrenotationInteractor,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    getAdvertisement(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Number.isInteger(id)) {
            this.logger.warn("Invalid request path");
            throw new Error("Invalid request path");
        }
        this.viewAdvertisementInteractor.execute(id);
    }

    getAdvertisements(request: Request): void {
        let filters: any = {};
        if(request.body.get("include") === "metrics") {
            // filter results
            filters.area = request.pathParams.get("area");
            filters.longitude = request.pathParams.get("longitude");
            filters.latitude = request.pathParams.get("latitude");
            filters.distance = request.pathParams.get("distance");
            filters.maxDimensions = request.pathParams.get("max-dimensions");
            filters.minDimensions = request.pathParams.get("min-dimensions");
            filters.acceptableEnergyClasses = request.pathParams.get("acceptable-energy-classes");

            // TODO validate input

        } // else return all advertisements
        this.filterAdvertisementInteractor.execute(filters);
    }

    postOffer(request: Request): void {
        // It's not possible to know wether to call purchaseOffer or rentOffer with the available data.
        throw new Error("Not implemented");
    }

    postBooking(request: Request): void {
        const id = Number(request.pathParams.get("id"));

        if(!Number.isInteger(id)) {
            this.logger.warn("Invalid path params");
            throw new Error("Invalid path params");
        }

        this.bookVisitInteractor.execute(id);
    }

    postAdvertisement(request: Request): void {
        const address = request.body.get("address");
        const city = request.body.get("city");
        const latitude = request.body.get("coordinates").latitude;
        const longitude = request.body.get("coordinates").longitude;
        const images = request.body.get("images");
        const description = request.body.get("description");
        const dimensions = request.body.get("dimensions");
        const numberOfRooms = request.body.get("numberOfRooms");
        const energyClass = request.body.get("energyClass");
        const additionalServices = request.body.get("additionalServices");
        const nearbyPOIs = request.body.get("nearbyPOIs");
        const kind = request.body.get("kind");

        let advertisement: Advertisement
        if(kind === "sale") {
            // TODO where should I get the concrete advertisement builder? where do I get it from?
        }

        throw new Error("Implementation incomplete");

    }

    patchAdvertisement(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        const taken = Boolean(request.body.get("taken"));

        if(!Number.isInteger(id)){
            this.logger.warn("Invalid path params");
            throw new Error("Invalid path params");
        }

        if(!taken) {
            this.logger.warn("Invalid body");
            throw new Error("Invalid body");
            // TODO verify if this is the inteded behaviour (it's currently not possible to revert the taken status)
        }

        this.markAsTakenInteractor.execute(id)

    }
}