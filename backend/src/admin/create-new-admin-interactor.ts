import {
    Admin,
    ValueAlreadyExistsException,
    type Logger,
    type CreatorOf,
    type RepositoryOf,
    User,
} from "@dieti-estates-2025/common";
import type { CreateNewAdminPresenter } from "./interfaces.js";
import { AdminAlreadySignedException } from "./errors.js";

export class CreateNewAdminInteractor {
    constructor(
        private presenter: CreateNewAdminPresenter,
        private creator: CreatorOf<"Admin", Admin, { username: string }>,
        private passwordRepository: RepositoryOf<"Password", string, User>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(
        email: string,
        username: string,
        password: string,
    ): Promise<Admin | null> {
        let admin: Admin;
        try {
            admin = await this.creator.createAdmin(new Admin(email, username));
        } catch (err) {
            if (err instanceof ValueAlreadyExistsException) {
                this.logger.warn(
                    `Attempted to create admin ${username} that already exists`,
                );
                this.presenter.presentError(new AdminAlreadySignedException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                this.presenter.presentError(
                    err instanceof Error ? err : new Error("Unknown error"),
                );
                throw err;
            }
        }
        // create a password entry so the new admin can authenticate
        await this.passwordRepository.createPassword(admin, password);

        this.presenter.present(admin);
        this.logger.info(`Admin with username ${username} created`);
        return admin;
    }
}
