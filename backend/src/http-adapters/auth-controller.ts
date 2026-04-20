import type { Logger } from "@dieti-estates-2025/common";
import type { SimpleLoginInteractor } from "../auth/src/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/src/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/src/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/src/third-party-signup-interactor.js";

export class AuthController {
    constructor(
        private simpleLoginInteractor: SimpleLoginInteractor,
        private simpleSignupInteractor: SimpleSignupInteractor,
        private thirdPartyLoginInteractor: ThirdPartyLoginInteractor,
        private thirdPartySignupInteractor: ThirdPartySignupInteractor,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    login(request: Request): void {
        //TODO implement
    }

    signup(request: Request): void {
        //TODO implement
    }
}