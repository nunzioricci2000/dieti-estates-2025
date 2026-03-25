import type { Admin } from "../../../common/entities/src/user.js";
import type { AdminRepository, CreateNewAdminPresenter, FirstAdminConfig, FirstLaunchDetector } from "./interfaces.js";

class SetupFirstAdminInteractor {
    config: FirstAdminConfig;
    detector: FirstLaunchDetector;
    presenter: CreateNewAdminPresenter;
    repository: AdminRepository;

    constructor(config: FirstAdminConfig, detector: FirstLaunchDetector, 
        presenter: CreateNewAdminPresenter, repository: AdminRepository
    ) {
        this.config = config;
        this.detector = detector;
        this.presenter = presenter;
        this.repository = repository;
    }

    execute(): Admin {
        throw new Error("To be implemented")
    }
}