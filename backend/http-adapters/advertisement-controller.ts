import type { Logger } from "@dieti-estates-2025/utilities";
import type { Request } from "../../common/http-utils/src/request.js";
import type { ViewAdvertisementInteractor } from "../user/src/view-advertisement-interactor.js";
import type { FilterAdvertisementsInteractor } from "../user/src/filter-advertisements-interactor.js";
import type { MakeOfferInteractor } from "../user/src/make-offer-interactor.js";
import type { BookVisitInteractor } from "../user/src/book-visit-interactor.js";
import type { CreateNewAdvertisementInteractor } from "../dashboard/src/create-new-advertisement-interactor.js";
import type { RetrieveAdvertisementsMetricsInteractor } from "../dashboard/src/retrieve-advertisements-metrics-interactor.js";
import type { CountIncomingOfferInteractor } from "../dashboard/src/count-incoming-offer-interactor.js";
import type { CountIncomingViewInteractor } from "../dashboard/src/count-incoming-view-interactor.js";
import type { MarkAsTakenInteractor } from "../dashboard/src/mark-as-taken-interactor.js";
import type { CountIncomingPrenotationInteractor } from "../dashboard/src/count-incoming-prenotation-interactor.js";
import { AdvertisementDTO } from "../../common/http-utils/src/dto.js";
import { Response } from "../../common/http-utils/src/response.js";
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

        // TODO insert validation by validator object

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
        // TODO Insert validation by validator object

        this.makeOfferInteractor.execute(id);
    }

    postBooking(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        // TODO Insert validation by validator object

        this.bookVisitInteractor.execute(id);
    }

    postAdvertisement(request: Request): void {
        const adcertisement  = AdvertisementDTO.fromJSON(request.body)
        if(!AdvertisementDTO) {
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

        // TODO build advertisement using the builder and the builder director

        throw new Error("Implementation incomplete");

    }

    patchAdvertisement(request: Request): void {
        const id = Number(request.pathParams.get("id"));
        const taken = Boolean(request.body.taken);

        // TODO insert validation by validators

        if(!taken) {
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
        
        this.markAsTakenInteractor.execute(id)

    }
}