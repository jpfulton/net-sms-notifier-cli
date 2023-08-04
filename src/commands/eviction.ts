import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { getTwilioClient } from "../utils/twilio.js";

export async function eviction(serverName: string): Promise<void> {
  const config = readConfigurationFromDefaultPath();
  const client = getTwilioClient();

  const message = createMessage(config, serverName);

  console.log(chalk.blue.bold("Notifying administrators of eviction."));

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
