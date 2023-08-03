import chalk from "chalk";
import { wrapMessage } from "../utils/format.js";

export async function eviction(serverName: string): Promise<void> {
  const message = createMessage(serverName);

  console.log(chalk.blue.bold(message));
}

function createMessage(serverName: string): string {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const message = `The ${serverName} server has been evicted at ${time}.`;

  return wrapMessage(message);
}
