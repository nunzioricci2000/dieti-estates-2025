import { type Logger } from "@dieti-estates-2025/common";
import { LoggerRecord, type LogLevel } from "./logger-record.js";
import { EventEmitter } from "node:events";

class NodeLogger
    extends EventEmitter<{ [key in LogLevel]: [LoggerRecord] }>
    implements Logger
{
    constructor() {
        super();
    }

    error(...args: unknown[]): void {
        this.log("error", ...args);
    }

    warn(...args: unknown[]): void {
        this.log("warn", ...args);
    }

    info(...args: unknown[]): void {
        this.log("info", ...args);
    }

    debug(...args: unknown[]): void {
        this.log("debug", ...args);
    }

    private log(level: LogLevel, ...args: unknown[]): void {
        const record = LoggerRecord.create(level, args);
        this.emit(level, record);
    }
}

export { NodeLogger };
