import chalk from "chalk";
import { validateConfiguration } from "../utils/configuration.js";

export function validate(): void {
  console.log(chalk.blue.bold("Validating configuration file."));

  try {
    validateConfiguration();
  } catch (error) {
    // throw an error that forces a process exit with an error code
    throw new Error("Invalid configuration file.", {
      cause: (error as Error).message,
    });
  }
}
