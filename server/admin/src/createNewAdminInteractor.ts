import type { Admin } from "../../../common/entities/src/user.js";
import type { AdminRepository, CreateNewAdminPresenter } from "./interfaces.js";

class CreateNewAdminInteractor {
    presenter: CreateNewAdminPresenter;
    repository: AdminRepository;

    constructor(presenter: CreateNewAdminPresenter, repository: AdminRepository) {
        this.presenter = presenter;
        this.repository = repository;
    }

    execute(username: string, password: string): Admin {
        throw new Error("To be implemented");
    }
}