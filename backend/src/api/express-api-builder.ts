import type { APIBuilder } from "./api-builder.js";
import { ExpressAPI } from "./express-api.js";
import { type Express } from "express";
import { type Request as ExpressRequest } from "express";
import { ExpressRequestBuilder } from "./express-request-builder.js";
import {
    type Request,
    RequestBuilderDirector,
} from "@dieti-estates-2025/common";

export class ExpressAPIBuilder implements APIBuilder<ExpressAPI> {
    private requestBuilderDirector = new RequestBuilderDirector();

    constructor(private app: Express) { }

    private buildRequest(req: ExpressRequest): Request {
        const requestBuilder = new ExpressRequestBuilder(req);
        return this.requestBuilderDirector.makeRequest(requestBuilder);
    }

    buildAuthRouter(): void {
        this.app.post("/auth/signup", (req, _, next) => {
            req.authController.signup(this.buildRequest(req));
            next();
        });
        this.app.post("/auth/login", (req, _, next) => {
            req.authController.login(this.buildRequest(req));
            next();
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get("/advertisements", (req, _, next) => {
            req.advertisementController.getAdvertisements(
                this.buildRequest(req),
            );
            next();
        });
        this.app.get("/advertisements/:id", (req, _, next) => {
            req.advertisementController.getAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
        this.app.post("/advertisements/:id/offers", (req, _, next) => {
            req.advertisementController.postOffer(this.buildRequest(req));
            next();
        });
        this.app.post("/advertisements", (req, _, next) => {
            req.advertisementController.postAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
        this.app.patch("/advertisements/:id", (req, _, next) => {
            req.advertisementController.patchAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
    }

    buildAdminRouter(): void {
        this.app.post("/admins", (req, _, next) => {
            req.adminController.postAdmin(this.buildRequest(req));
            next();
        });
        this.app.patch("/admins", (req, _, next) => {
            req.adminController.patchAdmin(this.buildRequest(req));
            next();
        });
    }

    buildAgentRouter(): void {
        this.app.post("/agents", (req, _, next) => {
            req.agentController.postAgent(this.buildRequest(req));
            next();
        });
    }

    getResult(): ExpressAPI {
        return new ExpressAPI(this.app);
    }
}
