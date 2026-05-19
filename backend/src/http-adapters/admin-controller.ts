import {
    type Logger,
    Request,
    Response,
    PasswordDTO,
    SignUpRequestDTO,
    Admin,
} from "@dieti-estates-2025/common";
import type { CreateNewAdminInteractor } from "../admin/create-new-admin-interactor.js";
import type { EditAdminPasswordInteractor } from "../admin/edit-admin-password-interactor.js";
import type { ResponseManager } from "./response-manager.js";
import type { TokenService } from "../auth/interfaces.js";

export class AdminController {
    constructor(
        private createNewAdminInteractor: CreateNewAdminInteractor,
        private editAdminPassword: EditAdminPasswordInteractor,
        private responseManager: ResponseManager,
        private tokenService: TokenService,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    async postAdmin(request: Request) {
        const admin = SignUpRequestDTO.fromObject(request.body);
        if (!admin) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }

        await this.createNewAdminInteractor.execute(
            admin.email,
            admin.username,
            admin.password,
        );

        this.logger.info("New Admin creted!");
    }

    async patchAdmin(request: Request) {
        const newPassword = PasswordDTO.fromObject(request.body);
        const admin = request.body.admin;
        if (!newPassword) {
            this.logger.warn("Invalid request");
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }

        this.logger.debug("Sending response");
        await this.editAdminPassword.execute(admin, newPassword.password);
    }
}
