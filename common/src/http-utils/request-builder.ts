import { Request } from "./request.js";

export interface RequestBuilder {
    setMethod(): void;
    setPath(): void;
    setBody(): void;
    setPathParams(): void;
    setQueryParams(): void;
    setHeaders(): void;
    getResult(): Request;
}