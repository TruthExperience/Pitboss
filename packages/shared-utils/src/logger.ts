export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void => {
    console.debug(JSON.stringify({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      context
    }));
  },
  info: (message: string, context?: Record<string, unknown>): void => {
    console.info(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context
    }));
  },
  warn: (message: string, context?: Record<string, unknown>): void => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context
    }));
  },
  error: (message: string, context?: Record<string, unknown>): void => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context
    }));
  }
};
