import pkg from "twilio";
const { Twilio } = pkg;

import { readConfigurationFromDefaultPath } from "./configuration.js";

export function getTwilioClient() {
  const config = readConfigurationFromDefaultPath();
  const client = new Twilio(config.accountSid, config.authToken);

  return client;
}
