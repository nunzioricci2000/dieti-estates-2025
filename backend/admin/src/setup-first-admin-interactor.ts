import { Admin, User } from "@dieti-estates-2025/entities";
import type { CreateNewAdminPresenter, FirstAdminConfig, FirstLaunchDetector } from "./interfaces.js";
import type { CreatorOf, Logger, RepositoryOf } from "@dieti-estates-2025/utilities";
import { InvalidConfigurationError } from "./errors.js";

export class SetupFirstAdminInteractor {
    constructor(
        private config: FirstAdminConfig, 
        private detector: FirstLaunchDetector, 
        private presenter: CreateNewAdminPresenter, 
        private adminCreator: CreatorOf<"Admin", Admin, {email: string}>,
        private passwordRepository: RepositoryOf<"Password", string, User>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(): Admin | null {
        if(!this.detector.isFirstLaunch()) {
            return null;
        }

        const email = this.config.getEmail();
        const username = this.config.getUsername();
        const password = this.config.getPassword();

        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(username.length < 8 || password.length < 8 || !re.test(email)) {
            this.logger.error("Invalid configuration provided for first admin credentials.");
            this.presenter.presentError(new InvalidConfigurationError());
            return null;
        }

        const admin = this.adminCreator.createAdmin(new Admin(email, username));
        this.passwordRepository.createPassword(admin, password);
        this.presenter.present(admin);
        this.logger.info("First admin created!");
        return admin;
    }
}