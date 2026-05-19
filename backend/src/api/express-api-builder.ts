import type { APIBuilder } from "./api-builder.js";
import { ExpressAPI } from "./express-api.js";
import { type Express } from "express";
import { type Request as ExpressRequest } from "express";
import { ExpressRequestBuilder } from "./express-request-builder.js";
import {
    type Request,
    RequestBuilderDirector,
} from "@dieti-estates-2025/common";
import multer from "multer";
import {
    advertisementMultipartHandler,
    authorizationHandlerFactory,
} from "./middleware.js";

export class ExpressAPIBuilder implements APIBuilder<ExpressAPI> {
    private requestBuilderDirector = new RequestBuilderDirector();
    private userAthorizationMiddlware = authorizationHandlerFactory("user");
    private adminAthorizationMiddlware = authorizationHandlerFactory("admin");
    private agentAthorizationMiddlware = authorizationHandlerFactory("agent");

    constructor(private app: Express) { }

    private buildRequest(req: ExpressRequest): Request {
        const requestBuilder = new ExpressRequestBuilder(req);
        return this.requestBuilderDirector.makeRequest(requestBuilder);
    }

    buildAuthRouter(): void {
        this.app.post("/auth/signup", async (req, _res, next) => {
            await req.authController.signup(this.buildRequest(req));
            next();
        });
        this.app.post("/auth/login", async (req, _res, next) => {
            await req.authController.login(this.buildRequest(req));
            next();
        });
    }

    buildAdvertisementRouter(): void {
        this.app.get("/advertisements", async (req, _res, next) => {
            await req.advertisementController.getAdvertisements(
                this.buildRequest(req),
            );
            next();
        });
        this.app.get("/advertisements/:id", async (req, _res, next) => {
            await req.advertisementController.getAdvertisement(
                this.buildRequest(req),
            );
            next();
        });
        this.app.post(
            "/advertisements/:id/offers",
            this.userAthorizationMiddlware,
            async (req, _res, next) => {
                await req.advertisementController.postOffer(
                    this.buildRequest(req),
                );
                next();
            },
        );

        const storage = multer.diskStorage({
            destination: "images/",
            filename: (req, file, cb) =>
                cb(null, Date.now() + "-" + file.originalname),
        });
        const upload = multer({ storage });
        this.app.post(
            "/advertisements",
            this.agentAthorizationMiddlware,
            upload.array("images", 10),
            advertisementMultipartHandler,
            async (req, _res, next) => {
                await req.advertisementController.postAdvertisement(
                    this.buildRequest(req),
                );
                next();
            },
        );
        this.app.patch(
            "/advertisements/:id",
            this.agentAthorizationMiddlware,
            async (req, _res, next) => {
                await req.advertisementController.patchAdvertisement(
                    this.buildRequest(req),
                );
                next();
            },
        );
    }

    buildAdminRouter(): void {
        this.app.post(
            "/admins",
            this.adminAthorizationMiddlware,
            async (req, _res, next) => {
                await req.adminController.postAdmin(this.buildRequest(req));
                next();
            },
        );
        this.app.patch(
            "/admins/me/password",
            this.adminAthorizationMiddlware,
            async (req, _res, next) => {
                req.body.admin = req.user;
                await req.adminController.patchAdmin(this.buildRequest(req));
                next();
            },
        );
    }

    buildAgentRouter(): void {
        this.app.post(
            "/agents",
            this.adminAthorizationMiddlware,
            async (req, _res, next) => {
                await req.agentController.postAgent(this.buildRequest(req));
                next();
            },
        );
    }

    getResult(): ExpressAPI {
        return new ExpressAPI(this.app);
    }
}
