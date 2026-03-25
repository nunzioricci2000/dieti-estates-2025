import type { User } from "@dieti-estates-2025/entities";
import type { AuthRegister } from "./authRegister.js";
import type { SignupPresenter } from "./interfaces.js";

export class SimpleSignupInteractor {
    authRegister: AuthRegister;
    presenter: SignupPresenter;
    
    constructor(authRegister: AuthRegister, presenter: SignupPresenter) {
        this.authRegister = authRegister;
        this.presenter = presenter;
    }

    execute(username: string, password: string): User {
        throw new Error("To be implemented");
    }
}