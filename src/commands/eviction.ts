import chalk from "chalk";

import { readConfigurationFromDefaultPath } from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { getTwilioClient } from "../utils/twilio.js";

export async function eviction(serverName: string): Promise<void> {
  const message = createMessage(serverName);
  const config = readConfigurationFromDefaultPath();
  const client = getTwilioClient();

  console.log(chalk.blue.bold("Notifying administrators of eviction."));

  config.toNumbers.forEach(async (number) => {
    await client.messages.create({
      messagingServiceSid: config.messageServiceSid,
      to: number,
      body: message,
    });
  });
}

function createMessage(serverName: string): string {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const message = `The ${serverName} server has been evicted at ${time}.`;

  return wrapMessage(message);
}
