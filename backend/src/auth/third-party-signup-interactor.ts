import { type User, type Logger, ValueAlreadyExistsException } from "@dieti-estates-2025/common";
import type { AuthRegister } from "./auth-register.js";
import type { SignupPresenter } from "./interfaces.js";
import { InsufficientDataException, UserAlreadySignedException } from "./errors.js";

export class ThirdPartySignupInteractor {
    constructor(
        private authRegister: AuthRegister,
        private presenter: SignupPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(authorizationCode: string): Promise<User | null> {
        const data = this.authRegister.thirdPartyAuthService.authenticateUser(authorizationCode);
        const user = data.user;
        const provider = data.provider;
        const sub = data.sub;

        if(!user.email || !user.username) {
            this.presenter.presentError(new InsufficientDataException());
            return null;
        }

        try {
            await this.authRegister.subRepository.createSub({sub, provider}, user);
        } catch(e) {
            if(e instanceof ValueAlreadyExistsException) {
                this.logger.warn("Attempted creation of existing user (conflicting sub or email)");
                this.presenter.presentError(new UserAlreadySignedException());
                return null;
            } else {
                this.logger.error("Unexpected error"); 
                this.presenter.presentError(new Error());
                return null;
            }
        }
        return user;
    }
}
