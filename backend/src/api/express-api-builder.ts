import type { AdminController } from "../http-adapters/admin-controller.js";
import type { AdvertisementController } from "../http-adapters/advertisement-controller.js";
import type { AgentController } from "../http-adapters/agent-controller.js";
import type { AuthController } from "../http-adapters/auth-controller.js";
import type { APIBuilder } from "./api-builder.js";
import type { ExpressApiConfig } from "./express-api-config.js";
import { ExpressAPI } from "./express-api.js";
import express from "express";
import { ExpressRequestBuilder } from "./express-request-builder.js";
import type { RequestBuilderDirector } from "@dieti-estates-2025/common";

export class ExpressAPIBuilder implements APIBuilder<ExpressAPI> {
    private authController?: AuthController;
    private advertisementController?: AdvertisementController;
    private adminController?: AdminController;
    private agentController?: AgentController;
    private app = express();

    constructor(
        private expressAPIConfig: ExpressApiConfig, 
        private builderDirector: RequestBuilderDirector,
    ) {}

    buildAuthRouter(): void {
        this.app.post('/auth/signup', (eReq, eRes) => {
            //signup
        });
        this.app.post('/auth/login', (eReq, eRes) => {
            //login
        });
        this.app.post('/auth/re-authenticate', (eReq, eRes)=> {
            //reauthenticate
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get('/advertisements', (eReq, eRes) => {
            //retrieve advertisements (all or filtered)
            //advertisement metrics (query parameter 'iclude=metrics')
        });
        this.app.get('/advertisements/:id', (eReq, eRes) => {
            //retrieve specific advertisement
        });
        this.app.post('/advertisements/:id/offers', (eReq, eRes) => {
            //new offer
        });
        this.app.post('/advertisements', (eReq, eRes) => {
            //new advertisement
        });
        this.app.patch('/advertisements/:id', (eReq, eRes) => {
            //mark as taken
        });
    }

    buildAdminRouter(): void {
        this.app.post('/admins', (eReq, eRes) => {
            //new admin
        })
        this.app.patch('/admins', (eReq, eRes) => {
            //change admin password
        })
    }

    buildAgentRouter(): void {
        this.app.post('/agents', (eReq, eRes) => {
            //new agent
        })
    }

    getResult(): ExpressAPI {
        if(!(this.authController && this.advertisementController && 
            this.adminController && this.agentController
        )) {
            throw new Error("Insufficient data");
        }
        return new ExpressAPI(
            this.authController,
            this.advertisementController,
            this.agentController,
            this.adminController,
        );
    }

}