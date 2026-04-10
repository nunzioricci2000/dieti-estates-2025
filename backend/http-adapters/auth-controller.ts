import type { Logger } from "@dieti-estates-2025/utilities";
<<<<<<<< HEAD:backend/httpAdapters/src/authController.ts
import type { SimpleLoginInteractor } from "../../auth/src/simpleLoginInteractor.js";
import type { SimpleSignupInteractor } from "../../auth/src/simpleSignupInteractor.js";
import type { ThirdPartyLoginInteractor } from "../../auth/src/thirdPartyLoginInteractor.js";
import type { ThirdPartySignupInteractor } from "../../auth/src/thirdPartySignupInteractor.js";
========
import type { SimpleLoginInteractor } from "../auth/src/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/src/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/src/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/src/third-party-signup-interactor.js";
>>>>>>>> main:backend/http-adapters/auth-controller.ts

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