import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
  validateConfigurationFromObject,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { TwilioMessage, sendMessage } from "../utils/twilio.js";

export function vpnUnauthorizedAttempt(options: {
  ip: string;
  certificateCN: string;
}): void {
  const { ip, certificateCN } = options;

  console.log(
    chalk.blue.bold("Notifying administrators of VPN connection attempt.")
  );

  const config = readConfigurationFromDefaultPath();
  validateConfigurationFromObject(config);

  const message = createMessage(config, ip, certificateCN);
  sendMessage(config, message);
}

function createMessage(
  config: Configuration,
  ip: string,
  certificateCN: string
): TwilioMessage {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    timeStyle: "long",
  });

  const message = `Bad VPN connection attempt from ${ip} using ${certificateCN} at ${time}.`;

  return wrapMessage(config, message);
}
