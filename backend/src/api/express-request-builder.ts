import { Request, type RequestBuilder, isMethod } from "@dieti-estates-2025/common";
import { type Request as ExpressRequest } from "express";

export class ExpressRequestBuilder implements RequestBuilder {
    private req: Partial<Request> = {};
    constructor(private exprReq: ExpressRequest) {}

    setMethod(): void {
        const method = this.exprReq.method.toUpperCase();
        if(!isMethod(method)) {
            throw new Error(`Unsupported HTTP method: ${this.exprReq.method}`);
        }
        this.req.method = method;
    }

    setPath(): void {
        this.req.path = this.exprReq.path;
    }

    setBody(): void {
        this.req.body = this.exprReq.body;
    }

    setPathParams(): void {
        const paramsMap = new Map<string, string>();
        const params = this.exprReq.params;
        if(params.id) {
            paramsMap.set("id", params.id.toString());
        }
        this.req.pathParams = paramsMap;
    }

    setQueryParams(): void {
        const query = this.exprReq.query;
        const queryMap = new Map<string, string>();
        for(const key in query) {
            if(!query[key]) {
                continue;
            }
            queryMap.set(key, query[key].toString());
        }
        this.req.queryParams = queryMap;
    }

    setHeaders(): void {
        const headers = this.exprReq.headers;
        const headersMap = new Map<string, string>();
        for(const key in headers) {
            if(!headers[key]) {
                continue;
            }
            headersMap.set(key, headers[key].toString());
        }
    }

    getResult(): Request {
        if(!(this.req.method && this.req.path && this.req.body && this.req.headers && 
            this.req.pathParams && this.req.queryParams
        )) {
            throw new Error("Insufficient data");
        }
        return new Request(
            this.req.method,
            this.req.path,
            this.req.body,
            this.req.headers,
            this.req.pathParams,
            this.req.queryParams,
        )
    }

}