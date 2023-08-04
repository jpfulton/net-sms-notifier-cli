import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { getTwilioClientFromConfiguration } from "../utils/twilio.js";

export async function eviction(serverName: string): Promise<void> {
  console.log(chalk.blue.bold("Notifying administrators of eviction."));

  const config = readConfigurationFromDefaultPath();
  const message = createMessage(config, serverName);

  sendMessage(config, message);
}

function sendMessage(config: Configuration, message: string) {
  const client = getTwilioClientFromConfiguration(config);

  config.toNumbers.forEach(async (number) => {
    await client.messages.create({
      messagingServiceSid: config.messageServiceSid,
      to: number,
      body: message,
    });
  });
}

function createMessage(config: Configuration, serverName: string): string {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const message = `The ${serverName} server has been evicted at ${time}.`;

  return wrapMessage(config, message);
}
