import type { APIBuilder } from "./api-builder.js";
import type { ExpressApiConfig } from "./express-api-config.js";
import { ExpressAPI } from "./express-api.js";
import express from "express";
import { type Request as ExpressRequest } from "express";
import { ExpressRequestBuilder } from "./express-request-builder.js";
import type { Request, RequestBuilderDirector } from "@dieti-estates-2025/common";

export class ExpressAPIBuilder implements APIBuilder<ExpressAPI> {
    private app = express();

    constructor(
        private config: ExpressApiConfig, 
        private requestBuilderDirector: RequestBuilderDirector,
    ) {}

    private buildRequest(eReq: ExpressRequest): Request {
        const requestBuilder = new ExpressRequestBuilder(eReq);
        return this.requestBuilderDirector.makeRequest(requestBuilder);
    }


    buildAuthRouter(): void {
        this.app.post('/auth/signup', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAuthController(req);
            controller.signup(req);
            next();
        });
        this.app.post('/auth/login', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAuthController(req);
            controller.login(req);
            next();
        });
        this.app.post('/auth/re-authenticate', (eReq, eRes, next)=> {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAuthController(req);
            controller.signup(req);
            next();
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get('/advertisements', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdvertisementController(req);
            controller.getAdvertisements(req);
            next();
        });
        this.app.get('/advertisements/:id', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdvertisementController(req);
            controller.getAdvertisement(req);
            next();
        });
        this.app.post('/advertisements/:id/offers', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdvertisementController(req);
            controller.postOffer(req);
            next();
        });
        this.app.post('/advertisements', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdvertisementController(req);
            controller.postAdvertisement(req);
            next();
        });
        this.app.patch('/advertisements/:id', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdvertisementController(req);
            controller.patchAdvertisement(req);
            next();
        });
    }

    buildAdminRouter(): void {
        this.app.post('/admins', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdminController(req);
            controller.postAdmin(req);
            next();
        })
        this.app.patch('/admins', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAdminController(req);
            controller.patchAdmin(req);
            next();
        })
    }
    
    buildAgentRouter(): void {
        this.app.post('/agents', (eReq, eRes, next) => {
            const req = this.buildRequest(eReq);
            const controller = this.config.createAgentController(req);
            controller.postAgent(req);
            next();
        })
    }

    getResult(): ExpressAPI {
        return new ExpressAPI(
            this.app,
            this.config.port,
        );
    }

}