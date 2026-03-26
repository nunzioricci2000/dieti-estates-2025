import type { Admin } from "@dieti-estates-2025/entities";
import type { AdminRepository, CreateNewAdminPresenter, FirstAdminConfig, FirstLaunchDetector } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";

class SetupFirstAdminInteractor {
    constructor(
        private config: FirstAdminConfig, 
        private detector: FirstLaunchDetector, 
        private presenter: CreateNewAdminPresenter, 
        private repository: AdminRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(): Admin | null {
        if(this.detector.isFirstLaunch()) {
            const admin = this.repository.createAdmin(this.config.getUsername(), this.config.getPassword());
            this.presenter.present(admin);
            return admin;
        }

        throw new Error("To be implemented")
    }
}