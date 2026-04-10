import { Response } from "../../common/http-utils/src/response.js";

export interface ResponseManager {
    sendResponse(response: Response): void;
    sendError(error: Error): void;
}