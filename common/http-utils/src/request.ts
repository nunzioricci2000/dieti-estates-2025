export class Request {
    method: Method;
    path: string;
    body: Map<string, any>;
    headers: Map<string, string>;
    pathParams: Map<string, string>;
    queryParams: Map<string, string>;

    constructor(method: Method, path: string, body: Map<string, any>, headers: Map<string, string>,
        pathParams: Map<string, string>, queryParams: Map<string, string>
    ) {
        this.method = method;
        this.path = path;
        this.body = body;
        this.headers = headers;
        this.pathParams = pathParams;
        this.queryParams = queryParams;
    }
}

enum Method {
    GET, 
    HEAD,
    POST,
    PUT,
    DELETE,
    CONNECT,
    OPTIONS,
    TRACE,
    PATCH,
}