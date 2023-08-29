import chalk from "chalk";

import {
  Configuration,
  readConfigurationFromDefaultPath,
  validateConfigurationFromObject,
} from "../utils/configuration.js";
import { wrapMessage } from "../utils/format.js";
import { TwilioMessage, sendMessage } from "../utils/twilio.js";

export function vpnConnection(options: {
  ip: string;
  certificateCN: string;
}): void {
  const { ip, certificateCN } = options;

  console.log(
    chalk.blue.bold("Notifying administrators of VPN connection success.")
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

  const message = `VPN connection established from ${ip} using CN=${certificateCN} at ${time}.`;

  return wrapMessage(config, message);
}
