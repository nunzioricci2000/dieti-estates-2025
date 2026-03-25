import type { AuthRegister } from "./authRegister.js";
import type { LoginPresenter } from "./interfaces.js";
import { User } from "@dieti-estates-2025/entities";

export class ThirdPartyLoginInteractor {
    authRegister: AuthRegister;
    presenter: LoginPresenter;

    constructor(authRegister: AuthRegister, presenter: LoginPresenter) {
        this.authRegister = authRegister;
        this.presenter = presenter;
    }

    execute(authorizationCode: string): User {
        throw new Error("To be implemented");
    }

}