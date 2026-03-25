import type { User } from "../../../common/entities/src/user.js";
import type { AuthRegister } from "./authRegister.js";
import type { SignupPresenter } from "./interfaces.js";

class thirdPartySignupInteractor {
    authRegister: AuthRegister;
    presenter: SignupPresenter;

    constructor(authRegister: AuthRegister, presenter: SignupPresenter) {
        this.authRegister = authRegister;
        this.presenter = presenter;
    }

    execute(authorizationCode: string): User {
        throw new Error("To be implemented");
    }
}