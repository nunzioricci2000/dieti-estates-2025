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
        this.app.post("/auth/signup", async (req) => {
            await req.authController.signup(this.buildRequest(req));
        });
        this.app.post("/auth/login", async (req) => {
            await req.authController.login(this.buildRequest(req));
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get("/advertisements", async (req) => {
            await req.advertisementController.getAdvertisements(
                this.buildRequest(req),
            );
        });
        this.app.get("/advertisements/:id", async (req) => {
            await req.advertisementController.getAdvertisement(
                this.buildRequest(req),
            );
        });
        this.app.post("/advertisements/:id/offers", async (req) => {
            await req.advertisementController.postOffer(this.buildRequest(req));
        });
        this.app.post("/advertisements", async (req) => {
            await req.advertisementController.postAdvertisement(
                this.buildRequest(req),
            );
        });
        this.app.patch("/advertisements/:id", async (req) => {
            await req.advertisementController.patchAdvertisement(
                this.buildRequest(req),
            );
        });
    }

    buildAdminRouter(): void {
        this.app.post("/admins", async (req) => {
            await req.adminController.postAdmin(this.buildRequest(req));
        });
        this.app.patch("/admins", async (req) => {
            await req.adminController.patchAdmin(this.buildRequest(req));
        });
    }

    buildAgentRouter(): void {
        this.app.post("/agents", async (req) => {
            await req.agentController.postAgent(this.buildRequest(req));
        });
    }

    getResult(): ExpressAPI {
        return new ExpressAPI(this.app);
    }
}
