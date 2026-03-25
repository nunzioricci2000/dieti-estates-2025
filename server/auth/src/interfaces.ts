import type { User } from "../../../common/entities/src/user.js";

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
    verifyToken(user: User, password: string): boolean;
}


export interface ThirdPartyAuthService {
    usernameFor(authorizationCode: string): string;
}

export interface UserRepository {
    createUser(user: User): User;
    readUserWithUsername(username: string): User;
    existsUserWithUsername(username: string): boolean;
}
export interface PasswordRepository {
    savePassword(user: User, password: string): void;
    verifyPassword(user: User, password: string): void;
}
