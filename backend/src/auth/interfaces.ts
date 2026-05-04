import type { User } from "@dieti-estates-2025/common";
import type { ThirdPartyIdentity } from "./data-objects.js";

export interface LoginPresenter {
    present(token: string): void;
    presentError(error: Error): void;
}

export interface SignupPresenter {
    present(token: string): void;
    presentError(error: Error): void;
}

export interface TokenService {
    generateToken(user: User): string;
    verifyToken(token: string): User;
}

export interface ThirdPartyAuthService {
    authenticateUser(authorizationCode: string): ThirdPartyIdentity;
}

export interface HashService {
    hashString(value: string): Promise<string>;
    verifyString(value: string, hash: string): Promise<boolean>;
}
