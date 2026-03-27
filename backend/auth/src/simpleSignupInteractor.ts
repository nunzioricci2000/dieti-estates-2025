import { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { SignupPresenter } from "./interfaces.js";
import { UserAlreadySignedException } from "./errors.js";
import type { Logger } from "@dieti-estates-2025/utilities";

export class SimpleSignupInteractor {
    constructor(
        private authRegister: AuthRegister, 
        private presenter: SignupPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(username: string, password: string): User | null {
        if(this.authRegister.userRepository.existsUserWithUsername(username)) {
            this.presenter.presentError(new UserAlreadySignedException());
            return null;
        }
        const user = this.authRegister.userRepository.createUser(username);
        this.authRegister.passwordRepository.savePassword(user, password);
        return user;
    }
}