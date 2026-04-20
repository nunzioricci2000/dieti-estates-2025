import type { RepositoryOf } from "@dieti-estates-2025/common";
import type { HashService, ThirdPartyAuthService, TokenService } from "./interfaces.js";
import type { User } from "@dieti-estates-2025/common";

type Email = { email: string }

export class AuthRegister {
    tokenService: TokenService;
    thirdPartyAuthService: ThirdPartyAuthService;
    passwordRepository: RepositoryOf<"Password", string, User>;
    userRepository: RepositoryOf<"User", User, Email>;
    hashService: HashService;

    constructor(tokenService: TokenService, thirdPartyAuthService: ThirdPartyAuthService,
        passwordRepository: RepositoryOf<"Password", string, User>,
        userRepository: RepositoryOf<"User", User, Email>,
        hashService: HashService,
    ) {
        this.tokenService = tokenService;
        this.thirdPartyAuthService = thirdPartyAuthService;
        this.passwordRepository = passwordRepository;
        this.userRepository = userRepository;
        this.hashService = hashService;
    }
}