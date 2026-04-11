import type { Logger } from "@dieti-estates-2025/utilities";
import type { CreateNewAgentInteractor } from "../admin/src/create-new-agent-interactor.js";
import type { Request } from "../../common/http-utils/src/request.js";

export class AgentController {
    constructor(
        private createNewAgentInteractor: CreateNewAgentInteractor,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAgent(request: Request): void {
        const username = request.body.get("username");
        const email = request.body.get("email");
        const password = request.body.get("password");

        if(
            typeof username !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) {
            this.logger.warn("Invalid request body");
            throw new Error("Invalid request body");
        }

        this.createNewAgentInteractor.execute(email, username, password);
    }
}