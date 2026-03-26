import type { Admin } from "@dieti-estates-2025/entities";
import type { AdminRepository, EditAdminPasswordPresenter } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";

class EditAdminPasswordInteractor {
    constructor(
        private presenter: EditAdminPasswordPresenter, 
        private repository: AdminRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(admin: Admin, password: string): boolean {
        this.repository.editPassword(admin, password);
        this.presenter.present(admin);
        return true;
    }
}