import type { Admin } from "../../../common/entities/src/user.js";
import type { AdminRepository, EditAdminPasswordPresenter } from "./interfaces.js";

class EditAdminPasswordInteractor {
    presenter: EditAdminPasswordPresenter;
    repository: AdminRepository;

    constructor(presenter: EditAdminPasswordPresenter, repository: AdminRepository) {
        this.presenter = presenter;
        this.repository = repository;
    }

    execute(admin: Admin, password: string): boolean {
        throw new Error("To be implemented");
    }
}