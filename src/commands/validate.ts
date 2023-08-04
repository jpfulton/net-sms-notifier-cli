import chalk from "chalk";
import { validateConfiguration } from "../utils/configuration.js";

export function validate(): void {
  console.log(chalk.blue.bold("Validating configuration file."));

  if (validateConfiguration()) {
    console.log(chalk.green("Configuration file appears valid."));
  } else {
    console.error(chalk.red("Configuration file is invalid."));
    throw new Error("Invalid configuration.");
  }
}
