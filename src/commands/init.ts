import chalk from "chalk";
import fs from "fs";
import path from "path";

import { CONFIG_FILE_TEMPLATE } from "../utils/configuration.js";

const configurationDir = "/etc/sms-notifier";
const configurationFile = "notifier.json";

export async function init(): Promise<void> {
  console.log(chalk.blue.bold("Creating configuration directory and files."));

  fs.access(configurationDir, (error) => {
    if (error) {
      console.log(chalk.blue("Creating configuration directory."));
      fs.mkdir(configurationDir, 755, (error) => {
        if (error) {
          console.error(chalk.red("Failed to create configuration directory."));
          throw error;
        }
      });
    } else {
      console.log(chalk.red("Configuration directory exists."));
    }
  });

  const fullConfigurationFilePath = path.join(
    configurationDir,
    configurationFile
  );

  fs.access(fullConfigurationFilePath, (error) => {
    if (error) {
      console.log(chalk.blue("Creating configuration file from template."));
      fs.writeFile(fullConfigurationFilePath, CONFIG_FILE_TEMPLATE, (error) => {
        if (error) {
          console.error(
            chalk.red("Failed to write configuration file template.")
          );
          throw error;
        }

        console.log(chalk.blue("Setting configuration file permissions."));
        fs.chmod(fullConfigurationFilePath, 0o640, (error) => {
          if (error) {
            console.error(
              chalk.red("Failed to set configuration file permissions.")
            );
            throw error;
          }
        });
      });
    } else {
      console.log(chalk.red("Configuration file exists."));
    }
  });
}
