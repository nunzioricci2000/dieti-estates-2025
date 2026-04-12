import type { Logger } from "@dieti-estates-2025/utilities";
import type { SimpleLoginInteractor } from "../auth/src/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/src/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/src/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/src/third-party-signup-interactor.js";
import { Request } from "../../common/http-utils/src/request.js";
import type { LoginRequestDTO, SignUpRequestDTO } from "../../common/http-utils/src/dto.js";

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
        const credentials: LoginRequestDTO = {
            email: request.body.email,
            password: request.body.password,
        }

        // TODO insert validation by validator object

        this.simpleLoginInteractor.execute(
            credentials.email, 
            credentials.password,
        );
    }

    signup(request: Request): void {
        const credentials: SignUpRequestDTO = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
        }

        // TODO insert validation by validator object

        this.simpleSignupInteractor.execute(
            credentials.username, 
            credentials.email, 
            credentials.password,
        );
    }
}