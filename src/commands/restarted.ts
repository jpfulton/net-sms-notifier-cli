import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { sendMessage } from "../utils/twilio.js";

export function restarted(serverName: string): void {
  console.log(chalk.blue.bold("Notifying administrators of restart."));

  const config = readConfigurationFromDefaultPath();
  const message = createMessage(config, serverName);

  sendMessage(config, message);
}

function createMessage(config: Configuration, serverName: string): string {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    timeStyle: "long",
  });
  const message = `The ${serverName} server has been restarted at ${time}.`;

  return wrapMessage(config, message);
}
