import type { Request } from "@dieti-estates-2025/common";
import type { AuthController } from "../http-adapters/auth-controller.js";
import type { AdvertisementController } from "../http-adapters/advertisement-controller.js";
import type { AgentController } from "../http-adapters/agent-controller.js";
import type { AdminController } from "../http-adapters/admin-controller.js";

export interface ExpressApiConfig {
    readonly port: number;
    createAuthController(req: Request): AuthController;
    createAdvertisementController(req: Request): AdvertisementController;
    createAgentController(req: Request): AgentController;
    createAdminController(req: Request): AdminController;
}