type LogLevel = "error" | "warn" | "info" | "debug";

class LoggerRecord {
    private constructor(
        public readonly timestamp: Date,
        public readonly level: LogLevel,
        public readonly file: string,
        public readonly line: number,
        public readonly column: number,
        public readonly caller: string,
        public readonly message: unknown[],
    ) { }

    static create(level: LogLevel, message: unknown[]): LoggerRecord {
        const timestamp = new Date();
        const stack = new Error().stack;
        let file = "unknown.ts";
        let line = -1;
        let column = -2;
        let caller = "unknownCaller";

        if (stack) {
            const lines = stack.split("\n");
            if (lines.length > 4) {
                const match = lines[4]?.match(/\s+at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
                if (match) {
                    caller = match[1] ?? caller;
                    file = match[2] ?? file;
                    line = match[3] ? parseInt(match[3], 10) : line;
                    column = match[4] ? parseInt(match[4], 10) : column;
                }
            }
        }

        return new LoggerRecord(timestamp, level, file, line, column, caller, message);
    }
}

export { LoggerRecord, type LogLevel };