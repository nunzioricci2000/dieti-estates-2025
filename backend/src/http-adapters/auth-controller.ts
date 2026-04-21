import { type Logger, Request, Response, LoginRequestDTO, SignUpRequestDTO } from "@dieti-estates-2025/common";
import type { SimpleLoginInteractor } from "../auth/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/third-party-signup-interactor.js";
import type { ResponseManager } from "./response-manager.js";

export class AuthController {
    constructor(
        private simpleLoginInteractor: SimpleLoginInteractor,
        private simpleSignupInteractor: SimpleSignupInteractor,
        private thirdPartyLoginInteractor: ThirdPartyLoginInteractor,
        private thirdPartySignupInteractor: ThirdPartySignupInteractor,
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    login(request: Request): void {
        const credentials = LoginRequestDTO.fromJSON(request.body);

        if(!credentials) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }

        this.simpleLoginInteractor.execute(
            credentials.email, 
            credentials.password,
        );
    }

    signup(request: Request): void {
        const credentials = SignUpRequestDTO.fromJSON(request.body);

        if(!credentials) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }

        this.simpleSignupInteractor.execute(
            credentials.username, 
            credentials.email, 
            credentials.password,
        );
    }
}
