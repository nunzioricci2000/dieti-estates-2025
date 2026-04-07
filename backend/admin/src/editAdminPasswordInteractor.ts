import type { Admin, User } from "@dieti-estates-2025/entities";
import type { EditAdminPasswordPresenter } from "./interfaces.js";
import { ValueNotFoundException, type Logger, type RepositoryOf } from "@dieti-estates-2025/utilities";
import { AdminNotExistsException } from "./errors.js";

class EditAdminPasswordInteractor {
    constructor(
        private presenter: EditAdminPasswordPresenter, 
        private repository: RepositoryOf<"Password", string, User>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(admin: Admin, password: string): boolean {
        try{
            this.repository.updatePassword(admin, password);
        } catch(err) {
            if(err instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted to edit password of non existent admin ${admin.username}`);
                this.presenter.presentError(new AdminNotExistsException());
                return false;
            } else {
                this.logger.error("Unexpected error occcured");
                throw err;
            }
        }
        this.presenter.present(admin);
        return true;
    }
}