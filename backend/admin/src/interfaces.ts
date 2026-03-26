import type { Admin, Agent } from "@dieti-estates-2025/entities";

export interface FirstAdminConfig {
    getUsername(): string;
    getPassword(): string;
}

export interface FirstLaunchDetector {
    isFirstLaunch(): boolean;
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

export interface AdminRepository {
    createAdmin(username: string, password: string): Admin;
    editPassword(admin: Admin, password: string): void;
}

export interface AgentRepository {
    createAgent(username: string, password: string): Agent;
}