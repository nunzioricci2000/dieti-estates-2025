import { Response } from "@dieti-estates-2025/common";

export interface ResponseManager {
    sendResponse(response: Response): void;
}
