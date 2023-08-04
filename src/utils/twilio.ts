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
