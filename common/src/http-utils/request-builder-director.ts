import type { RequestBuilder } from "./request-builder.js";
import type { Request } from "./request.js";

export class RequestBuilderDirector {
    makeRequest(builder: RequestBuilder): Request {
        builder.setMethod();
        builder.setPath();
        builder.setBody();
        builder.setPathParams();
        builder.setQueryParams();
        builder.setHeaders();
        return builder.getResult();
    }
}