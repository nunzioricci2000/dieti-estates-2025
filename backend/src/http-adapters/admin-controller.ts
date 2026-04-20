import { type Logger, Request, Response, PasswordDTO, SignUpRequestDTO } from "@dieti-estates-2025/common";
import type { CreateNewAdminInteractor } from "../admin/create-new-admin-interactor.js";
import type { EditAdminPasswordInteractor } from "../admin/edit-admin-password-interactor.js";
import type { ResponseManager } from "./response-manager.js";

export class AdminController {
    constructor(
        private createNewAdminInteractor: CreateNewAdminInteractor,
        private editAdminPassword: EditAdminPasswordInteractor,
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAdmin(request: Request): void {
        const admin = SignUpRequestDTO.fromJSON(request.body);
        if (!admin) {
            // Invalid request
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
            return;
        }

        this.createNewAdminInteractor.execute(
            admin.email, 
            admin.username, 
            admin.password,
        );

        this.logger.info("New Admin creted!");
    }

    patchAdmin(request: Request): void {
        const newPassword = PasswordDTO.fromJSON(request.body);
        if(!newPassword) {
            // Invalid request
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
            return;
        }



        // TODO Insert validation by validator
        // TODO complete when the class will be able to retrieve the user who performed the request

        throw new Error("Not yet implemented");
    }
}