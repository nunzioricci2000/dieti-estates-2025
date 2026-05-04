import type { Admin, Agent } from "@dieti-estates-2025/common";

export interface FirstAdminConfig {
    getEmail(): string;
    getUsername(): string;
    getPassword(): string;
}

export interface FirstLaunchDetector {
    isFirstLaunch(): Promise<boolean>;
}

export interface CreateNewAdminPresenter {
    present(admin: Admin): void;
    presentError(error: Error): void;
}

export interface EditAdminPasswordPresenter {
    present(admin: Admin): void;
    presentError(error: Error): void;
}

export interface CreateNewAgentPresenter {
    present(agent: Agent): void;
    presentError(error: Error): void;
}
