import chalk from "chalk";
import fs from "fs";
import path from "path";
import { env } from "process";

import { CommanderError } from "commander";
import { isWin } from "./platform.js";
import { isValidE164Number } from "./twilio.js";

export const CONFIGURATION_DIR = "/etc/sms-notifier";
export const WIN_CONFIGURATION_DIR = `${env.ALLUSERSPROFILE}/sms-notifier`;
export const CONFIGURATION_FILE = "notifier.json";

export const CONFIGURATION_DIR_PERMISSIONS = 0o755;
export const CONFIGURATION_FILE_PERMISSIONS = 0o640;

export const CONFIGURATION_FILE_TEMPLATE = `{
  "accountSid": "ACCOUNT_SID",
  "authToken": "AUTH_TOKEN",
  "messageServiceSid": "MESSAGE_SERVICE_SID",
  "brandIdentifier": "YOUR BRAND IDENTIFIER HERE",
  "toNumbers": [

  ]
}`;

export interface Configuration {
  accountSid: string;
  authToken: string;
  messageServiceSid: string;
  brandIdentifier: string;
  toNumbers: string[];
}

export function getDefaultConfigurationPath(): string {
  const configPath = isWin
    ? path.join(WIN_CONFIGURATION_DIR, CONFIGURATION_FILE)
    : path.join(CONFIGURATION_DIR, CONFIGURATION_FILE);
  return configPath;
}

export function readConfiguration(path: string): Configuration {
  try {
    const rawData = fs.readFileSync(path, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    throw new InvalidConfigurationError("Configuration file not found.");
  }
}

export function readConfigurationFromDefaultPath(): Configuration {
  const path = getDefaultConfigurationPath();
  return readConfiguration(path);
}

export function validateConfiguration(): void {
  const config = readConfiguration(getDefaultConfigurationPath());
  validateConfigurationFromObject(config);
}

export function validateConfigurationFromObject(config: Configuration): void {
  const exampleConfig: Configuration = JSON.parse(CONFIGURATION_FILE_TEMPLATE);

  if (JSON.stringify(config) === JSON.stringify(exampleConfig)) {
    throw new InvalidConfigurationError(
      "Configuration file is still identical to template."
    );
  }

  if (config.toNumbers && config.toNumbers.length === 0) {
    throw new InvalidConfigurationError(
      "No send numbers exist in configuration file."
    );
  }

  if (config.toNumbers && config.toNumbers.length !== 0) {
    let allValid = true;
    config.toNumbers.forEach((number) => {
      const isValid = isValidE164Number(number);

      if (!isValid) {
        console.error(
          chalk.red(
            `Found phone number in configuration file that is not in E.164 format: ${number}`
          )
        );
        allValid = false;
      }
    });

    if (!allValid)
      throw new InvalidConfigurationError(
        "Found at least one phone number that is not in E.164 format."
      );
  }

  return;
}

export const INVALID_CONFIGURATION_ERROR_CODE =
  "net-sms-notifier-cli.invalidConfiguration";

export class InvalidConfigurationError extends CommanderError {
  constructor(message: string) {
    if (message) {
      super(0, INVALID_CONFIGURATION_ERROR_CODE, message);
    } else {
      super(0, INVALID_CONFIGURATION_ERROR_CODE, "Invalid configuration file.");
    }

    // capture stacktrace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}
