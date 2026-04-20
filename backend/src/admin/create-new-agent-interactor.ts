import { Agent } from "@dieti-estates-2025/common";
import type { CreateNewAgentPresenter } from "./interfaces.js";
import { ValueAlreadyExistsException, type Logger, type CreatorOf } from "@dieti-estates-2025/common";
import { AgentAlreadySignedException } from "./errors.js";

class CreateNewAgentInteractor {
    constructor(
        private presenter: CreateNewAgentPresenter,
        private creator: CreatorOf<"Agent", Agent, { username: string }>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    execute(email: string, username: string, password: string): Agent | null {
        let agent: Agent;
        try {
            agent = this.creator.createAgent(new Agent(email, username));
        } catch (err) {
            if (err instanceof ValueAlreadyExistsException) {
                this.logger.warn(`Attempted to create agent with existing username: ${username}`);
                this.presenter.presentError(new AgentAlreadySignedException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                throw err;
            }
        }
        this.presenter.present(agent);
        this.logger.info(`Agent with username ${username} created`);
        return agent;
    }
}