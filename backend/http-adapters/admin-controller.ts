import type { Logger } from "@dieti-estates-2025/utilities";
import type { Request } from "../../common/http-utils/src/request.js";
import type { CreateNewAdminInteractor } from "../admin/src/create-new-admin-interactor.js";
import type { EditAdminPasswordInteractor } from "../admin/src/edit-admin-password-interactor.js";
import type { PasswordDTO, SignUpRequestDTO } from "../../common/http-utils/src/dto.js";

export class AdminController {
    constructor(
        private createNewAdminInteractor: CreateNewAdminInteractor,
        private editAdminPassword: EditAdminPasswordInteractor,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAdmin(request: Request): void {
        const admin: SignUpRequestDTO = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        }

        // TODO Insert validation by validator object

        this.createNewAdminInteractor.execute(
            admin.email, 
            admin.username, 
            admin.password
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