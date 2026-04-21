import { type Logger, Request, Response, AdvertisementDTO, Validator, AdvertisementAssembler, Coordinates } from "@dieti-estates-2025/common";
import type { ViewAdvertisementInteractor } from "../user/view-advertisement-interactor.js";
import type { FilterAdvertisementsInteractor, SearchFilters } from "../user/filter-advertisements-interactor.js";
import type { MakeOfferInteractor } from "../user/make-offer-interactor.js";
import type { BookVisitInteractor } from "../user/book-visit-interactor.js";
import type { CreateNewAdvertisementInteractor } from "../dashboard/create-new-advertisement-interactor.js";
import type { RetrieveAdvertisementsMetricsInteractor } from "../dashboard/retrieve-advertisements-metrics-interactor.js";
import type { CountIncomingOfferInteractor } from "../dashboard/count-incoming-offer-interactor.js";
import type { CountIncomingViewInteractor } from "../dashboard/count-incoming-view-interactor.js";
import type { MarkAsTakenInteractor } from "../dashboard/mark-as-taken-interactor.js";
import type { CountIncomingPrenotationInteractor } from "../dashboard/count-incoming-prenotation-interactor.js";
import type { ResponseManager } from "./response-manager.js";

export class Advertisement {
    constructor(
        private viewAdvertisementInteractor: ViewAdvertisementInteractor,
        private filterAdvertisementInteractor: FilterAdvertisementsInteractor,
        private makeOfferInteractor: MakeOfferInteractor,
        private bookVisitInteractor: BookVisitInteractor,
        private createNewAdvertisementInteractor: CreateNewAdvertisementInteractor,
        private retrieveAdvertisementsMetricsInteractor: RetrieveAdvertisementsMetricsInteractor,
        private countIncomingOfferInteractor: CountIncomingOfferInteractor,
        private countIncomingViewInteractor: CountIncomingViewInteractor,
        private markAsTakenInteractor: MarkAsTakenInteractor,
        private countIncomingPrenotationInteractor: CountIncomingPrenotationInteractor,
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    getAdvertisement(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.countIncomingViewInteractor.execute(id);
        this.viewAdvertisementInteractor.execute(id);
    }

    getAdvertisements(request: Request): void {
        if(request.body.include === "metrics") {
            // retrieve advertisement metrics
            this.retrieveAdvertisementsMetricsInteractor.execute();
        }
        let filters: SearchFilters = {};
        if(request.queryParams.size > 0) {
            // filter results
            const area = request.pathParams.get("area");
            const longitude = Number(request.pathParams.get("longitude"));
            const latitude = Number(request.pathParams.get("latitude"));
            const distance = Number(request.pathParams.get("distance"));
            const maxDimensions = Number(request.pathParams.get("max-dimensions"));
            const minDimensions = Number(request.pathParams.get("min-dimensions"));
            const acceptableEnergyClasses = request.pathParams.get("acceptable-energy-classes");

            area ? filters.area = area : {};
            Validator.validateCoordinates({latitude: latitude, longitude: longitude}) ? 
                filters.location = new Coordinates(latitude, longitude) : {};
            distance ? filters.distance = distance: {};
            maxDimensions ? filters.dimensionsMax = maxDimensions: {};
            minDimensions ? filters.dimensionsMin = minDimensions: {};
            acceptableEnergyClasses ? filters.acceptableEnergyClasses = acceptableEnergyClasses.split(","): {};
        } // else return all advertisements
        this.filterAdvertisementInteractor.execute(filters);
    }

    postOffer(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.countIncomingOfferInteractor.execute(id);
        this.makeOfferInteractor.execute(id);
    }

    postBooking(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.countIncomingPrenotationInteractor.execute(id);
        this.bookVisitInteractor.execute(id);
    }

    postAdvertisement(request: Request): void {
        const adDTO  = AdvertisementDTO.fromJSON(request.body)
        if(!adDTO) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        
        const ad = AdvertisementAssembler.createDomainObject(adDTO);
        this.createNewAdvertisementInteractor.execute(ad);
    }

    patchAdvertisement(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        const taken = Boolean(request.body.taken);

        if(!Validator.validateIntegers(id) || taken != true) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        
        this.markAsTakenInteractor.execute(id);
    }
}