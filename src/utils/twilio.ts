import pkg from "twilio";
const { Twilio } = pkg;

import {
  Configuration,
  readConfigurationFromDefaultPath,
} from "./configuration.js";

export function getTwilioClient() {
  const config = readConfigurationFromDefaultPath();
  return getTwilioClientFromConfiguration(config);
}

export function getTwilioClientFromConfiguration(config: Configuration) {
  const client = new Twilio(config.accountSid, config.authToken);
  return client;
}

export function sendMessage(config: Configuration, message: string) {
  const client = getTwilioClientFromConfiguration(config);

  config.toNumbers.forEach(async (number) => {
    await client.messages.create({
      messagingServiceSid: config.messageServiceSid,
      to: number,
      body: message,
    });
  });
}
