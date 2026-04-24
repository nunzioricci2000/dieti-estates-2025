import type { API } from "./api.js";
import express from "express"
import type { AuthController } from "../http-adapters/auth-controller.js";
import type { AdvertisementController } from "../http-adapters/advertisement-controller.js";
import type { AgentController } from "../http-adapters/agent-controller.js";
import type { AdminController } from "../http-adapters/admin-controller.js";

export class ExpressAPI implements API {
    constructor(
        private authController: AuthController,
        private advertisementController: AdvertisementController,
        private agentController: AgentController,
        private adminController: AdminController,
    ) {}

    start(): void {
        throw new Error("Method not implemented");
    }
}