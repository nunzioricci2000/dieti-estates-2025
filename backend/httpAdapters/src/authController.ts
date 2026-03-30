import type { Logger } from "@dieti-estates-2025/utilities";
import type { SimpleLoginInteractor } from "../../auth/src/simpleLoginInteractor.js";
import type { SimpleSignupInteractor } from "../../auth/src/simpleSignupInteractor.js";
import type { ThirdPartyLoginInteractor } from "../../auth/src/thirdPartyLoginInteractor.js";
import type { ThirdPartySignupInteractor } from "../../auth/src/thirdPartySignupInteractor.js";

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