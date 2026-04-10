import type { RequestBuilder } from "./request-builder.js";

export class RequestBuilderDirector {
    makeRequest(builder: RequestBuilder): Request {
        throw new Error("To be implemented");
    }
}