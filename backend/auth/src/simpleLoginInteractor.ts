import type { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { LoginPresenter } from "./interfaces.js";
import { UserNotExistsException, WrongPasswordException } from "./errors.js";
import type { Logger } from "@dieti-estates-2025/utilities";

export class SimpleLoginInteractor {
    constructor(
        private authRegister: AuthRegister, 
        private presenter: LoginPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(email: string, password: string): User | null {
        let user;
        try {
            user = this.authRegister.userRepository.readUser({email});
        } catch(err) {
            if(err instanceof UserNotExistsException) {
                this.logger.warn(`Attempted login with email ${email} which does not exist`);
                this.presenter.presentError(new UserNotExistsException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        const storedPassword = this.authRegister.passwordRepository.readPassword(user);
        if (!this.authRegister.hashService.verifyString(password, storedPassword)) {
            this.logger.warn(`Attempted login as user ${email} with incorrect password`)
            this.presenter.presentError(new WrongPasswordException());
            return null;
        }
        const token = this.authRegister.tokenService.generateToken(user);
        this.presenter.present(token)
        this.logger.debug(`User ${email} performed login`);
        return user;
    }
}