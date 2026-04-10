import type { Logger } from "@dieti-estates-2025/utilities";
import type { AuthRegister } from "./auth-register.js";
import type { LoginPresenter } from "./interfaces.js";
import { User } from "@dieti-estates-2025/entities";

export class ThirdPartyLoginInteractor {
    constructor(
        private authRegister: AuthRegister,
        private presenter: LoginPresenter,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(authorizationCode: string): User {
        throw new Error("To be implemented");
    }

}