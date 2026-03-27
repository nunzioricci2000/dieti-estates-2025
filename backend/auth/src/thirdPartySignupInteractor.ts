import type { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { SignupPresenter } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";

export class ThirdPartySignupInteractor {
    constructor(
        private authRegister: AuthRegister, 
        private presenter: SignupPresenter, 
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(authorizationCode: string): User {
        throw new Error("To be implemented");
    }
}