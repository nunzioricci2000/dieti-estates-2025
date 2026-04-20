import { Response } from "./response.js";

export interface ResponseManager {
    sendResponse(response: Response): void;
    sendError(error: Error): void;
}
