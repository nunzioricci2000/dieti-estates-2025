export class Response {
    code: number;
    body: Map<string, any>;
    headers: Map<string, string>;

    constructor(code: number, body: Map<string, any>, headers: Map<string, string>) {
        this.code = code;
        this.body = body;
        this.headers = headers;
    }
}