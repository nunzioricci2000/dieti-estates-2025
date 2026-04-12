import type { Logger } from "@dieti-estates-2025/utilities";
import type { CreateNewAgentInteractor } from "../admin/src/create-new-agent-interactor.js";
import type { Request } from "../../common/http-utils/src/request.js";
import type { SignUpRequestDTO } from "../../common/http-utils/src/dto.js";

export class AgentController {
    constructor(
        private createNewAgentInteractor: CreateNewAgentInteractor,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAgent(request: Request): void {
        const agent: SignUpRequestDTO = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
        }
        // TODO insert validation by validator object

        this.createNewAgentInteractor.execute(
            agent.email,
            agent.username,
            agent.password
        );
    }
}