import { type Logger, Request, Response, AdvertisementDTO, Validator, AdvertisementAssembler } from "@dieti-estates-2025/common";
import type { ViewAdvertisementInteractor } from "../user/view-advertisement-interactor.js";
import type { FilterAdvertisementsInteractor } from "../user/filter-advertisements-interactor.js";
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
        this.viewAdvertisementInteractor.execute(id);
    }

    getAdvertisements(request: Request): void {
        let filters: any = {};
        if(request.body.include === "metrics") {
            // filter results
            filters.area = request.pathParams.get("area");
            filters.longitude = request.pathParams.get("longitude");
            filters.latitude = request.pathParams.get("latitude");
            filters.distance = request.pathParams.get("distance");
            filters.maxDimensions = request.pathParams.get("max-dimensions");
            filters.minDimensions = request.pathParams.get("min-dimensions");
            filters.acceptableEnergyClasses = request.pathParams.get("acceptable-energy-classes");

            // TODO Insert validation by validator object

        } // else return all advertisements
        this.filterAdvertisementInteractor.execute(filters);
    }

    postOffer(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.responseManager.sendResponse(new Response(
                400,
                {
                    "error": "Invalid request",
                },
                new Map<string, string>,
            ));
            return;
        }

        this.makeOfferInteractor.execute(id);
    }

    postBooking(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        if(!Validator.validateIntegers(id)) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }
        this.bookVisitInteractor.execute(id);
    }

    postAdvertisement(request: Request): void {
        const adDTO  = AdvertisementDTO.fromJSON(request.body)
        if(!adDTO) {
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
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