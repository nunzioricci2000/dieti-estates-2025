import type { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { LoginPresenter } from "./interfaces.js";

export class SimpleLoginInteractor {
    authRegister: AuthRegister;
    loginPresenter: LoginPresenter;

    constructor(authRegister: AuthRegister, loginPresenter: LoginPresenter) {
        this.authRegister = authRegister;
        this.loginPresenter = loginPresenter;
    }

    execute(username: string, password: string): User {
        throw new Error("To be implemented");
    }
}