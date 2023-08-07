import pkg from "twilio";
const { Twilio } = pkg;

import {
  Configuration,
  readConfigurationFromDefaultPath,
} from "./configuration.js";

export enum RegulatoryMessageSuffix {
  Default = "Reply STOP to unsubscribe.",
}
export type TwilioMessage = `${string}: ${string} ${RegulatoryMessageSuffix}`;

export function getTwilioClient() {
  const config = readConfigurationFromDefaultPath();
  return getTwilioClientFromConfiguration(config);
}

export function getTwilioClientFromConfiguration(config: Configuration) {
  const client = new Twilio(config.accountSid, config.authToken);
  return client;
}

export function sendMessage(config: Configuration, message: TwilioMessage) {
  const client = getTwilioClientFromConfiguration(config);

  config.toNumbers.forEach(async (number) => {
    await client.messages.create({
      messagingServiceSid: config.messageServiceSid,
      to: number,
      body: message,
    });
  });
}

export function isValidE164Number(number: string): boolean {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(number);
}
