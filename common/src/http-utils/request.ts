export const methods = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"] as const;

export type Method = typeof methods[number];

export function isMethod(value: string): value is Method {
    return (methods as readonly string[]).includes(value);
}

export class Request {
    method: Method;
    path: string;
    body: any;
    headers: Map<string, string>;
    pathParams: Map<string, string>;
    queryParams: Map<string, string>;

    constructor(
        method: Method,
        path: string,
        body: any,
        headers: Map<string, string>,
        pathParams: Map<string, string>,
        queryParams: Map<string, string>,
    ) {
        this.method = method;
        this.path = path;
        this.body = body;
        this.headers = headers;
        this.pathParams = pathParams;
        this.queryParams = queryParams;
    }
}
