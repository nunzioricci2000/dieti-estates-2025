export class Response {
    code: number;
    body: any;
    headers: Map<string, string>;

    constructor(
        code: number,
        body: any,
        headers: Map<string, string>,
    ) {
        this.code = code;
        this.body = body;
        this.headers = headers;
    }

    setHeader(key: string, value: string): void {
        this.headers.set(key, value);
    }

    static readonly INVALID_REQUEST = new Response(400, {"error": "Invalid request"}, new Map<string, string>());
    static readonly UNAUTHORIZED = new Response(402, {"error": "Unauthorized"}, new Map<string, string>());
    static readonly NOT_FOUND = new Response(404, {"error": "Not found"}, new Map<string, string>());
    static readonly CONFLICT = new Response(409, {"error": "Conflict"}, new Map<string, string>());
    static readonly SERVER_ERROR = new Response(500, {"error": "Server error"}, new Map<string, string>());
}
