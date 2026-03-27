import type { PasswordRepository, ThirdPartyAuthService, TokenService, UserRepository } from "./interfaces.js";

export class AuthRegister {
    tokenService: TokenService;
    thirdPartyAuthService: ThirdPartyAuthService;
    passwordRepository: PasswordRepository;
    userRepository: UserRepository;

    constructor(tokenService: TokenService, thirdPartyAuthService: ThirdPartyAuthService,
        passwordRepository: PasswordRepository, userRepository: UserRepository
    ) {
        this.tokenService = tokenService;
        this.thirdPartyAuthService = thirdPartyAuthService;
        this.passwordRepository = passwordRepository;
        this.userRepository = userRepository;
    }
}