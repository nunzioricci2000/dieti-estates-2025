import { LoggerRecord } from "./logger-record.js";
import path from "node:path";

function logToConsole(record: LoggerRecord) {
    const { level } = record;
    let logMessage = formatRecord(record);
    if (consoleSupportsColor()) {
        const color = colors[level] || "";
        const reset = colors.reset;
        logMessage = logMessage.map((part) => `${color}${part}${reset}`);
    }
    console[level](...logMessage);
}

function formatRecord(record: LoggerRecord): any[] {
    const { timestamp, level, file, line, column, caller, message } = record;
    const relativeFile = relativePath(file);
    return [
        `[${timestamp.toISOString()}]`,
        `[${level.toUpperCase()}]`,
        `${relativeFile}:${line}:${column}`,
        `(${caller})`,
        `-`,
        ...message,
    ];
}

function consoleSupportsColor(): boolean {
    return (
        process.stdout.isTTY &&
        process.env.TERM !== "dumb" &&
        !process.env.NO_COLOR
    );
}

function relativePath(filePath: string): string {
    if (path.isAbsolute(filePath)) {
        return path.relative(process.cwd(), filePath);
    }
    return filePath;
}

const colors: { [key: string]: string } = {
    error: "\x1b[31m", // Red
    warn: "\x1b[33m", // Yellow
    info: "", // Default color
    debug: "\x1b[34m", // Blue
    reset: "\x1b[0m", // Reset
};

export { logToConsole };
