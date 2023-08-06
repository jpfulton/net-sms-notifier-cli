import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
  validateConfigurationFromObject,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { sendMessage } from "../utils/twilio.js";

export function vpnAttempt(options: {
  ip: string;
  certificateCN: string;
}): void {
  const { ip, certificateCN } = options;

  console.log(
    chalk.blue.bold("Notifying administrators of VPN connection attempt.")
  );

  const config = readConfigurationFromDefaultPath();
  if (!validateConfigurationFromObject(config)) {
    console.error(chalk.red.bold("Invalid configuration file. Exiting."));
    throw new Error("Invalid configuration file.");
  }

  const message = createMessage(config, ip, certificateCN);
  sendMessage(config, message);
}

function createMessage(
  config: Configuration,
  ip: string,
  certificateCN: string
): string {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    timeStyle: "long",
  });

  const message = `VPN connection attempt from ${ip} using ${certificateCN} at ${time}.`;

  return wrapMessage(config, message);
}
