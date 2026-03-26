import type { Admin } from "@dieti-estates-2025/entities";
import type { AdminRepository, CreateNewAdminPresenter } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";

class CreateNewAdminInteractor {
    constructor(
        private presenter: CreateNewAdminPresenter, 
        private repository: AdminRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(username: string, password: string): Admin {
        const admin = this.repository.createAdmin(username, password);
        this.presenter.present(admin);
        return admin;
    }
}