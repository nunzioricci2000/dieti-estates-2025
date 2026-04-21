import type { EditAdminPasswordPresenter } from "./interfaces.js";
import {
    Admin,
    User,
    ValueNotFoundException,
    type Logger,
    type UpdaterOf,
} from "@dieti-estates-2025/common";
import { AdminNotExistsException } from "./errors.js";

export class EditAdminPasswordInteractor {
    constructor(
        private presenter: EditAdminPasswordPresenter,
        private updater: UpdaterOf<"Password", string, User>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(admin: Admin, password: string): Promise<boolean> {
        try {
            await this.updater.updatePassword(admin, password);
        } catch (err) {
            if (err instanceof ValueNotFoundException) {
                this.logger.warn(
                    `Attempted to edit password of non existent admin ${admin.username}`,
                );
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
