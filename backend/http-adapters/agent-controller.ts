import type { Logger } from "@dieti-estates-2025/utilities";
import type { CreateNewAgentInteractor } from "../admin/src/create-new-agent-interactor.js";
import type { Request } from "../../common/http-utils/src/request.js";
import { SignUpRequestDTO } from "../../common/http-utils/src/dto.js";
import type { ResponseManager } from "./response-manager.js";
import { Response } from "../../common/http-utils/src/response.js";

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
            const res = new Response(
                400,
                {
                    error: "Invalid request body"
                },
                new Map<string, string>(),
            )
            this.responseManager.sendResponse(res);
            return;
        }

        this.createNewAgentInteractor.execute(
            agent.email,
            agent.username,
            agent.password
        );
    }
}