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

export class AdvertisementController {
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

    async getAdvertisement(request: Request) {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.logger.debug("Calling interactors");
        this.countIncomingViewInteractor.execute(id);
        this.viewAdvertisementInteractor.execute(id);
    }

    async getAdvertisements(request: Request) {
        if(request.body.include === "metrics") {
            this.logger.debug("Executing retrieve advertisement metrics");
            this.retrieveAdvertisementsMetricsInteractor.execute();
        }
        let filters: SearchFilters = {};
        if(request.queryParams.size > 0) {
            this.logger.debug("Filtering advertisements");
            const area = request.queryParams.get("area");
            const longitude = Number(request.queryParams.get("longitude"));
            const latitude = Number(request.queryParams.get("latitude"));
            const distance = Number(request.queryParams.get("distance"));
            const maxDimensions = Number(request.queryParams.get("max-dimensions"));
            const minDimensions = Number(request.queryParams.get("min-dimensions"));
            const acceptableEnergyClasses = request.queryParams.get("acceptable-energy-classes");

            area ? filters.area = area : {};
            Validator.validateCoordinates({latitude: latitude, longitude: longitude}) ? 
                filters.location = new Coordinates(latitude, longitude) : {};
            distance ? filters.distance = distance: {};
            maxDimensions ? filters.dimensionsMax = maxDimensions: {};
            minDimensions ? filters.dimensionsMin = minDimensions: {};
            acceptableEnergyClasses ? filters.acceptableEnergyClasses = acceptableEnergyClasses.split(","): {};
        }
        this.logger.debug("Retrieving advertisements");
        this.filterAdvertisementInteractor.execute(filters);
    }

    async postOffer(request: Request) {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.logger.debug("Calling interactors");
        this.countIncomingOfferInteractor.execute(id);
        this.makeOfferInteractor.execute(id);
    }
    
    async postBooking(request: Request) {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.logger.debug("Calling interactors");
        this.countIncomingPrenotationInteractor.execute(id);
        this.bookVisitInteractor.execute(id);
    }
    
    async postAdvertisement(request: Request) {
        const adDTO  = AdvertisementDTO.fromJSON(request.body)
        if(!adDTO) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.logger.debug("Calling interactors");
        const ad = AdvertisementAssembler.createDomainObject(adDTO);
        this.createNewAdvertisementInteractor.execute(ad);
    }
    
    async patchAdvertisement(request: Request) {
        const id = Number(request.pathParams.get("id"));
        const taken = Boolean(request.body.taken);
        if(!Validator.validateIntegers(id) || taken != true) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.logger.debug("Calling interactors");
        this.markAsTakenInteractor.execute(id);
    }
}