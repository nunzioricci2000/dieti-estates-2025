import { type Logger } from "@dieti-estates-2025/utilities";
import { LoggerRecord } from "./logger-record.js";

type LogSubscriber = (record: LoggerRecord) => void;

class StreamLogger implements Logger {
    private subs: Map<string, LogSubscriber> = new Map();

    subscribe(subscriber: LogSubscriber): () => void {
        const id = crypto.randomUUID();
        if (!this.subs.has(id)) {
            this.subs.set(id, subscriber);
        }
        return () => {
            this.subs.delete(id);
        };
    }

    private emit(record: LoggerRecord): void {
        for (const subscriber of this.subs.values()) {
            subscriber(record);
        }
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

    private log(level: "error" | "warn" | "info" | "debug", ...args: unknown[]): void {
        const record = LoggerRecord.create(level, args.map(arg => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "));
        this.emit(record);
    }
}

const defaultLogSubscriber: LogSubscriber = (record) => {
    const { timestamp, level, file, line, column, caller, message } = record;
    const logMessage = `[${timestamp.toISOString()}] [${level.toUpperCase()}] ${file}:${line}:${column} (${caller}) - ${message}`;
    switch (level) {
        case "error":
            console.error(logMessage);
            break;
        case "warn":
            console.warn(logMessage);
            break;
        case "info":
            console.info(logMessage);
            break;
        case "debug":
            console.debug(logMessage);
            break;
    }
}

export { StreamLogger, type LogSubscriber, defaultLogSubscriber };