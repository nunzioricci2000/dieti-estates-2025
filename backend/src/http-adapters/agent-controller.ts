import { type Logger, Request, Response, SignUpRequestDTO } from "@dieti-estates-2025/common";
import type { CreateNewAgentInteractor } from "../admin/create-new-agent-interactor.js";
import type { ResponseManager } from "./response-manager.js";

export class AgentController {
    constructor(
        private createNewAgentInteractor: CreateNewAgentInteractor,
        private responseManager: ResponseManager,
        private logger: Logger,
    ) {
        logger.debug("Created!");
    }

    postAgent(request: Request): void {
        const agent =  SignUpRequestDTO.fromJSON(request.body);
        if(!agent) {
            this.responseManager.sendResponse(Response.INVALID_REQUEST);
            return;
        }

        this.createNewAgentInteractor.execute(
            agent.email,
            agent.username,
            agent.password
        );
    }
}