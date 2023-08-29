import chalk from "chalk";
import { validateConfiguration } from "../utils/configuration.js";

export function validate(): void {
  console.log(chalk.blue.bold("Validating configuration file."));

  validateConfiguration();
}
