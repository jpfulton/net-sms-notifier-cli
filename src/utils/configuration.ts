import chalk from "chalk";
import fs from "fs";
import path from "path";

export const CONFIGURATION_DIR = "/etc/sms-notifier";
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
  const configPath = path.join(CONFIGURATION_DIR, CONFIGURATION_FILE);
  return configPath;
}

export function readConfiguration(path: string): Configuration {
  const rawData = fs.readFileSync(path, "utf8");
  return JSON.parse(rawData);
}

export function readConfigurationFromDefaultPath(): Configuration {
  const path = getDefaultConfigurationPath();
  return readConfiguration(path);
}

export function validateConfiguration(): boolean {
  const config = readConfiguration(getDefaultConfigurationPath());

  const exampleConfig: Configuration = JSON.parse(CONFIGURATION_FILE_TEMPLATE);

  if (JSON.stringify(config) === JSON.stringify(exampleConfig)) {
    console.log(
      chalk.red("Configuration file is still identical to template.")
    );
    return false;
  }

  if (config.toNumbers && config.toNumbers.length === 0) {
    console.log(chalk.red("No send numbers exist in configuration file."));
    return false;
  }

  return true;
}
