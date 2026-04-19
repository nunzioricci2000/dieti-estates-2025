import type { Logger } from "@dieti-estates-2025/utilities";
import type { Request } from "../../common/http-utils/src/request.js";
import type { CreateNewAdminInteractor } from "../admin/src/create-new-admin-interactor.js";
import type { EditAdminPasswordInteractor } from "../admin/src/edit-admin-password-interactor.js";
import { SignUpRequestDTO, type PasswordDTO } from "../../common/http-utils/src/dto.js";
import type { ResponseManager } from "./response-manager.js";
import { Response } from "../../common/http-utils/src/response.js";

export class AdminController {
    constructor(
        private createNewAdminInteractor: CreateNewAdminInteractor,
        private editAdminPassword: EditAdminPasswordInteractor,
        private responseManage: ResponseManager,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAdmin(request: Request): void {
        const admin = new SignUpRequestDTO();
        if (!admin.fromJSON(request.body)) {
            // Invalid request
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManage.sendResponse(res);
            return;
        }

        this.createNewAdminInteractor.execute(
            admin.email as string, 
            admin.username as string, 
            admin.password as string,
        );

        this.logger.info("New Admin creted!");
    }

    patchAdmin(request: Request): void {
        const newPassword: PasswordDTO = {
            password: request.body.password,
        }

        // TODO Insert validation by validator
        // TODO complete when the class will be able to retrieve the user who performed the request

        throw new Error("Not yet implemented");
    }
}