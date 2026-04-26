import type { API } from "./api.js";
import type { Express } from "express";
import type { ExpressApiConfig } from "./express-api-config.js";

export class ExpressAPI implements API {
    constructor(
        private app: Express,
        private port: number
    ) {}

    start(): void {
        this.app.listen(this.port);
    }
}