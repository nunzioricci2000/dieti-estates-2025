import { 
    Admin, 
    ValueAlreadyExistsException, 
    type Logger, 
    type CreatorOf
} from "@dieti-estates-2025/common";
import type { CreateNewAdminPresenter } from "./interfaces.js";
import { AdminAlreadySignedException } from "./errors.js";

export class CreateNewAdminInteractor {
    constructor(
        private presenter: CreateNewAdminPresenter,
        private creator: CreatorOf<"Admin", Admin, { username: string }>,
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
                throw err;
            }
        }
        this.presenter.present(admin);
        this.logger.info(`Admin with username ${username} created`);
        return admin;
    }
}
