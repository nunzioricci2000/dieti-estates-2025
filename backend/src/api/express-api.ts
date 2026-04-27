import type { API } from "./api.js";
import type { Express } from "express";

export class ExpressAPI implements API {
    constructor(public app: Express) { }

    start(port: number): void {
        this.app.listen(port);
    }
}
