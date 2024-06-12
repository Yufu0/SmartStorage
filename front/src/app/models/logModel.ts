export class LogModel {
    logLevel: string;
    message: string;
    timestamp: number;

    constructor(logLevel: string, message: string, timestamp: number) {
        this.logLevel = logLevel;
        this.message = message;
        this.timestamp = timestamp;
    }
}
