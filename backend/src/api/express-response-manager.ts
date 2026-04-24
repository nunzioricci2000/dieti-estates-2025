import { type Response as ExpressResponse } from "express";
import type { ResponseManager } from "../http-adapters/response-manager.js";
import type { Response } from "@dieti-estates-2025/common";

export class ExpressResponseManager implements ResponseManager {
    response: ExpressResponse;

    constructor(response: ExpressResponse) {
        this.response = response;
    }

    sendResponse(response: Response): void {
        // TODO implement
        throw new Error("Not implemented");
    }
}