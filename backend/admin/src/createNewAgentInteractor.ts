import type { Agent } from "@dieti-estates-2025/entities";
import type { AgentRepository, CreateNewAgentPresenter } from "./interfaces.js";
import type { Logger } from "@dieti-estates-2025/utilities";

class CreateNewAgentInteractor {
    constructor(
        private presenter: CreateNewAgentPresenter, 
        private repository: AgentRepository,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(username: string, password: string): Agent {
        const agent = this.repository.createAgent(username, password);
        this.presenter.present(agent);
        return agent;
    }
}