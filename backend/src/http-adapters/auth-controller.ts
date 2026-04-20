import type { Logger } from "@dieti-estates-2025/common";
import type { SimpleLoginInteractor } from "../auth/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/third-party-signup-interactor.js";

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