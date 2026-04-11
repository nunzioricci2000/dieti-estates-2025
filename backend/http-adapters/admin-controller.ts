import type { Logger } from "@dieti-estates-2025/utilities";
import type { Request } from "../../common/http-utils/src/request.js";
import type { CreateNewAdminInteractor } from "../admin/src/create-new-admin-interactor.js";
import type { EditAdminPasswordInteractor } from "../admin/src/edit-admin-password-interactor.js";

export class AdminController {
    constructor(
        private createNewAdminInteractor: CreateNewAdminInteractor,
        private editAdminPassword: EditAdminPasswordInteractor,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAdmin(request: Request): void {
        const username = request.body.get("username");
        const email = request.body.get("email");
        const password = request.body.get("password");

        if(
            typeof username !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            this.logger.warn("Invalid request body");
            throw new Error("Invalid request body");
        }
        this.createNewAdminInteractor.execute(email, username, password);
    }

    patchAdmin(request: Request): void {
        const username = request.pathParams.get("username");
        const newPassword = request.body.get("password");

        if(
            typeof newPassword !== 'string'
        ) {
            this.logger.warn("Invalid request body");
            throw new Error("invalid request body");
        }
        // NOTE this.editAdminPassword.execute() should I really retrieve the admin here?
        throw new Error("Not yet implemented");
    }
}