import { User, ValueNotFoundException } from "@dieti-estates-2025/common";
import type { Logger } from "@dieti-estates-2025/common";
import type { AuthRegister } from "./auth-register.js";
import type { LoginPresenter } from "./interfaces.js";
import { UserNotExistsException } from "./errors.js";

export class ThirdPartyLoginInteractor {
    constructor(
        private authRegister: AuthRegister,
        private presenter: LoginPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(authorizationCode: string): Promise<User | null> {
        const data = this.authRegister.thirdPartyAuthService.authenticateUser(authorizationCode);
        const sub = data.sub;
        const provider = data.provider;
        let user: User | null = null;
        try {
            user = await this.authRegister.subRepository.readSub({sub, provider});
        } catch(e) {
            if(e instanceof ValueNotFoundException) {
                this.logger.warn(`Attempted login through ${provider} of unkown user`);
                this.presenter.presentError(new UserNotExistsException());
            } else {
                this.logger.error(`Unexpected error`);
                this.presenter.presentError(new Error());
            }
        }
        if(user) this.logger.debug(`User ${user.username} performed login`);
        return user;
    }
}
