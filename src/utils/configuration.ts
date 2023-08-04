import chalk from "chalk";
import fs from "fs";
import path from "path";

export const CONFIGURATION_DIR = "/etc/sms-notifier";
export const CONFIGURATION_FILE = "notifier.json";

export const CONFIGURATION_FILE_TEMPLATE = `{
  "accountSid": "ACCOUNT_SID",
  "authToken": "AUTH_TOKEN",
  "messageServiceSid": "MESSAGE_SERVICE_SID",
  "toNumbers": [

  ]
}`;

export interface Configuration {
  accountSid: string;
  authToken: string;
  messageServiceSid: string;
  toNumbers: string[];
}

export function readConfiguration(path: string): Configuration {
  const rawData = fs.readFileSync(path, "utf8");
  return JSON.parse(rawData);
}

export function validateConfiguration(): boolean {
  const configPath = path.join(CONFIGURATION_DIR, CONFIGURATION_FILE);
  const config = readConfiguration(configPath);

  const exampleConfig: Configuration = JSON.parse(CONFIGURATION_FILE_TEMPLATE);

  if (JSON.stringify(config) === JSON.stringify(exampleConfig)) {
    console.log(
      chalk.red("Configuration file is still identical to template.")
    );
    return false;
  }

  if (config.toNumbers.length === 0) {
    console.log(chalk.red("No send numbers exist in configuration file."));
    return false;
  }

  return true;
}
