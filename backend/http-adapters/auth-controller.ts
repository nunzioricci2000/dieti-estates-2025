import type { Logger } from "@dieti-estates-2025/utilities";
import type { SimpleLoginInteractor } from "../auth/src/simple-login-interactor.js";
import type { SimpleSignupInteractor } from "../auth/src/simple-signup-interactor.js";
import type { ThirdPartyLoginInteractor } from "../auth/src/third-party-login-interactor.js";
import type { ThirdPartySignupInteractor } from "../auth/src/third-party-signup-interactor.js";
import { Request } from "../../common/http-utils/src/request.js";
import { LoginRequestDTO, SignUpRequestDTO } from "../../common/http-utils/src/dto.js";
import type { ResponseManager } from "./response-manager.js";
import { Response } from "../../common/http-utils/src/response.js";

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
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
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
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
            return;
        }

        this.simpleSignupInteractor.execute(
            credentials.username, 
            credentials.email, 
            credentials.password,
        );
    }
}