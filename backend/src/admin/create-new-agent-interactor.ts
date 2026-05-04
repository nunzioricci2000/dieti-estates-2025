import type { CreateNewAgentPresenter } from "./interfaces.js";
import {
    Agent,
    ValueAlreadyExistsException,
    type Logger,
    type CreatorOf,
    type RepositoryOf,
    User,
} from "@dieti-estates-2025/common";
import { AgentAlreadySignedException } from "./errors.js";

export class CreateNewAgentInteractor {
    constructor(
        private presenter: CreateNewAgentPresenter,
        private creator: CreatorOf<"Agent", Agent, { username: string }>,
        private passwordRepository: RepositoryOf<"Password", string, User>,
        private logger: Logger,
    ) {
        logger.info("Created!");
    }

    async execute(
        email: string,
        username: string,
        password: string,
    ): Promise<Agent | null> {
        let agent: Agent;
        try {
            agent = await this.creator.createAgent(new Agent(email, username));
        } catch (err) {
            if (err instanceof ValueAlreadyExistsException) {
                this.logger.warn(
                    `Attempted to create agent with existing username: ${username}`,
                );
                this.presenter.presentError(new AgentAlreadySignedException());
                return null;
            } else {
                this.logger.error("Unexpected error occurred");
                this.presenter.presentError(
                    err instanceof Error ? err : new Error("Unknown error"),
                );
                throw err;
            }
        }
        // create a password entry so the new agent can authenticate
        await this.passwordRepository.createPassword(agent, password);

        this.presenter.present(agent);
        this.logger.info(`Agent with username ${username} created`);
        return agent;
    }
}
