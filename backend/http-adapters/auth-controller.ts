import type { Logger } from "@dieti-estates-2025/utilities";
import type { SimpleLoginInteractor } from "../auth/src/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/src/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/src/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/src/third-party-signup-interactor.js";
import { Request } from "../../common/http-utils/src/request.js";

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
        const email = request.body.email;
        const password = request.body.password;
        if (typeof email !== 'string' || typeof password !== 'string') {
            throw new Error("Invalid request body");
        }
        this.simpleLoginInteractor.execute(email, password);
    }

    signup(request: Request): void {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;
        if(typeof email !== 'string' || typeof password !== 'string' || typeof email !== 'string') {
            throw new Error("Invalid request body");
        }
        this.simpleSignupInteractor.execute(username, email, password);
    }
}