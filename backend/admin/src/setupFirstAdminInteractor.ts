import type { Admin } from "@dieti-estates-2025/entities";
import type { AdminRepository, CreateNewAdminPresenter, FirstAdminConfig, FirstLaunchDetector } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";
import { InvalidConfigurationError } from "./errors.js";

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
        if(!this.detector.isFirstLaunch()) {
            return null;
        }

        const username = this.config.getUsername();
        const password = this.config.getPassword();

        if(username.length < 8 || password.length < 8) {
            this.presenter.presentError(new InvalidConfigurationError());
            return null;
        }

        const admin = this.repository.createAdmin(username, password);
        this.presenter.present(admin);
        return admin;
    }
}