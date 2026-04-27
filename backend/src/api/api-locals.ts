import type { AdminController } from "../http-adapters/admin-controller.js";
import type { AdvertisementController } from "../http-adapters/advertisement-controller.js";
import type { AgentController } from "../http-adapters/agent-controller.js";
import type { AuthController } from "../http-adapters/auth-controller.js";

declare module "express-serve-static-core" {
    interface Request {
        authController: AuthController;
        advertisementController: AdvertisementController;
        adminController: AdminController;
        agentController: AgentController;
    }
}
