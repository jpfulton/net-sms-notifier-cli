import { Configuration } from "./configuration.js";

export function wrapMessage(config: Configuration, message: string): string {
  return `${config.brandIdentifier}: ${message} Reply STOP to unsubscribe.`;
}
