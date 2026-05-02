import type { AuthRegister } from "./auth-register.js";
import type { SignupPresenter } from "./interfaces.js";
import { UserAlreadySignedException } from "./errors.js";
import {
    User,
    ValueAlreadyExistsException,
    type Logger,
} from "@dieti-estates-2025/common";

export class SimpleSignupInteractor {
    constructor(
        private authRegister: AuthRegister,
        private presenter: SignupPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(
        username: string,
        email: string,
        password: string,
    ): Promise<User | null> {
        let user: User;
        try {
            user = await this.authRegister.userRepository.createUser(
                new User(email, username),
            );
        } catch (err) {
            if (err instanceof ValueAlreadyExistsException) {
                this.logger.warn("Attempted creation of an existing user");
                this.presenter.presentError(new UserAlreadySignedException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                this.presenter.presentError(
                    err instanceof Error ? err : new Error("Unknown error"),
                );
                throw err;
            }
        }
        await this.authRegister.passwordRepository.createPassword(
            user,
            password,
        );
        this.presenter.present(
            this.authRegister.tokenService.generateToken(user),
        );
        return user;
    }
}
