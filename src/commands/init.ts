import chalk from "chalk";
import fs from "fs";
import path from "path";

import {
  CONFIGURATION_DIR,
  CONFIGURATION_FILE,
  CONFIGURATION_FILE_TEMPLATE,
} from "../utils/configuration.js";

export function init(options: { force: boolean }): void {
  const forceMode = options.force;

  console.log(chalk.blue.bold("Creating configuration directory and files."));
  if (forceMode) {
    console.log(
      chalk.red.bold("Using force mode to overwrite configuration files.")
    );
  }

  fs.access(CONFIGURATION_DIR, (error) => {
    if (error) {
      console.log(chalk.blue("Creating configuration directory."));
      fs.mkdir(CONFIGURATION_DIR, 755, (error) => {
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
    CONFIGURATION_DIR,
    CONFIGURATION_FILE
  );

  fs.access(fullConfigurationFilePath, (error) => {
    if (error || forceMode) {
      console.log(chalk.blue("Creating configuration file from template."));

      if (forceMode && fs.existsSync(fullConfigurationFilePath)) {
        console.log(chalk.blue("Removing existing configuration file."));
        fs.rmSync(fullConfigurationFilePath);
      }

      const fd = fs.openSync(
        fullConfigurationFilePath,
        fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_RDWR,
        0o640
      );

      fs.writeFile(fd, CONFIGURATION_FILE_TEMPLATE, (error) => {
        if (error) {
          console.error(
            chalk.red("Failed to write configuration file template.")
          );

          fs.closeSync(fd);
          throw error;
        }

        fs.closeSync(fd);
      });
    } else {
      console.log(chalk.red("Configuration file exists."));
    }
  });
}
