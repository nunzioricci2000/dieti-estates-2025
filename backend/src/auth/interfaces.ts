import type { User } from "@dieti-estates-2025/common";

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
    usernameFor(authorizationCode: string): string;
}

export interface HashService {
    hashString(value: string): string;
    verifyString(value: string, hash: string): boolean;
}
