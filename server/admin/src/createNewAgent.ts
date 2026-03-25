import type { Agent } from "../../../common/entities/src/user.js";
import type { AgentRepository, CreateNewAgentPresenter } from "./interfaces.js";

class CreateNewAgent {
    presenter: CreateNewAgentPresenter;
    repository: AgentRepository;

    constructor(presenter: CreateNewAgentPresenter, repository: AgentRepository) {
        this.presenter = presenter;
        this.repository = repository;
    }

    execute(username: string, password: string): Agent {
        throw new Error("To be implemented");
    }
}