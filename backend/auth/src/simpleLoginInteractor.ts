import type { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { LoginPresenter } from "./interfaces.js";
import { UserNotExistsException, WrongPasswordException } from "./errors.js";
import type { Logger } from "@dieti-estates-2025/utilities";

export class SimpleLoginInteractor {
    constructor(
        private authRegister: AuthRegister, 
        private loginPresenter: LoginPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(username: string, password: string): User | null {
        if (!this.authRegister.userRepository.existsUserWithUsername(username)) {
            this.loginPresenter.presentError(new UserNotExistsException());
            return null;
        }
        const user = this.authRegister.userRepository.readUserWithUsername(username);
        if (!this.authRegister.passwordRepository.verifyPassword(user, password)) {
            this.loginPresenter.presentError(new WrongPasswordException());
            return null;
        }
        return user;
    }
}