import { User } from "@dieti-estates-2025/common";

export class Request {
    method: string;
    path: string;
    query: Map<string, any>;
    headers: Map<string, string>;
    body: Map<string, any>;
    user?: User;

    constructor(
        method: string,
        path: string,
        query: Map<string, any>,
        headers: Map<string, string>,
        body: Map<string, any>,
        user?: User,
    ) {
        this.method = method;
        this.path = path;
        this.query = query;
        this.headers = headers;
        this.body = body;
        if (user) {
            this.user = user;
        }
    }
}
