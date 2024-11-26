import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private static logFilePath = path.join(__dirname, '../../logs/app.log');
  private static errorLogFilePath = path.join(
    __dirname,
    '../../logs/error.log',
  );
  public static maxFileSize: number;
  public static configuredLogLevel: number;

  public static currentLogSize = 0;
  public static currentErrorLogSize = 0;

  constructor(private readonly configService: ConfigService) {
    super();

    const logDirectory = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }

    if (LoggingService.maxFileSize === undefined) {
      LoggingService.maxFileSize =
        parseInt(configService.get('LOG_MAX_SIZE_KB'), 10) * 1024 || 51200;

      const logLevelEnv = configService.get('LOG_LEVEL');
      LoggingService.configuredLogLevel = this.mapLevelToNumber(logLevelEnv);

      LoggingService.currentLogSize = this.getFileSize(
        LoggingService.logFilePath,
      );
      LoggingService.currentErrorLogSize = this.getFileSize(
        LoggingService.errorLogFilePath,
      );
    }
  }

  private mapLevelToNumber(level: string): number {
    switch (level) {
      case 'error':
      case '0':
        return 0;
      case 'warn':
      case '1':
        return 1;
      case 'log':
      case '2':
        return 2;
      case 'debug':
      case '3':
        return 3;
      case 'verbose':
      case '4':
        return 4;
      default:
        return 2;
    }
  }

  log(message: any, context?: string) {
    if (LoggingService.configuredLogLevel >= 2) {
      super.log(message, context);
      this.writeToFile('LOG', message, LoggingService.logFilePath);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (LoggingService.configuredLogLevel >= 0) {
      super.error(message, trace, context);
      this.writeToFile(
        'ERROR',
        message + (trace ? ` - ${trace}` : ''),
        LoggingService.errorLogFilePath,
      );
    }
  }

  warn(message: any, context?: string) {
    if (LoggingService.configuredLogLevel >= 1) {
      super.warn(message, context);
      this.writeToFile('WARN', message, LoggingService.logFilePath);
    }
  }

  debug(message: any, context?: string) {
    if (LoggingService.configuredLogLevel >= 3) {
      super.debug(message, context);
      this.writeToFile('DEBUG', message, LoggingService.logFilePath);
    }
  }

  verbose(message: any, context?: string) {
    if (LoggingService.configuredLogLevel >= 4) {
      super.verbose(message, context);
      this.writeToFile('VERBOSE', message, LoggingService.logFilePath);
    }
  }

  private writeToFile(level: string, message: string, filePath: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} [${level}] ${message}\n`;
    this.rotateLogFileIfNeeded(filePath);
    fs.appendFileSync(filePath, formattedMessage);
  }

  private getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  private rotateLogFileIfNeeded(filePath: string): void {
    const fileSize = this.getFileSize(filePath);

    if (fileSize >= LoggingService.maxFileSize) {
      this.rotateFile(filePath);
    }
  }

  private rotateFile(filePath: string): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedFilePath = `${filePath}.${timestamp}`;
    fs.renameSync(filePath, rotatedFilePath);
  }
}
