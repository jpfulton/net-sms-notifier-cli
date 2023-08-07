import { Configuration } from "./configuration.js";
import { RegulatoryMessageSuffix, TwilioMessage } from "./twilio.js";

export function wrapMessage(
  config: Configuration,
  message: string
): TwilioMessage {
  const twilioMessage: TwilioMessage = `${config.brandIdentifier}: ${message} ${RegulatoryMessageSuffix.Default}`;
  return twilioMessage;
}
