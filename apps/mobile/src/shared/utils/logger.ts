export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (__DEV__) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    const errorMeta = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, errorStack: error.stack, ...meta }
      : { rawError: error, ...meta };
    console.error(this.formatMessage('error', message, errorMeta));
  }
}

export const logger = new Logger();
