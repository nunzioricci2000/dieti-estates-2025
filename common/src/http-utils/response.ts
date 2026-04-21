export class Response {
    code: number;
    body: any;
    headers: Map<string, string>;

    constructor(code: number, body: any, headers: Map<string, string>) {
        this.code = code;
        this.body = body;
        this.headers = headers;
    }

    setHeader(key: string, value: string): void {
        this.headers.set(key, value);
    }

    static readonly INVALID_REQUEST = new Response(400, {"error": "Invalid request"}, new Map<string, string>());
}