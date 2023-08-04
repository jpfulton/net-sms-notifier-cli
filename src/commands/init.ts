import chalk from "chalk";
import fs from "fs";
import path from "path";

import {
  CONFIGURATION_DIR,
  CONFIGURATION_DIR_PERMISSIONS,
  CONFIGURATION_FILE,
  CONFIGURATION_FILE_PERMISSIONS,
  CONFIGURATION_FILE_TEMPLATE,
} from "../utils/configuration.js";
import { convertModeToPermissions } from "../utils/file-permissions.js";

export function init(options: { force: boolean }): void {
  const forceMode = options.force;

  console.log(chalk.blue.bold("Creating configuration directory and files."));
  if (forceMode) {
    console.log(
      chalk.red.bold(
        "WARNING: Using force mode to overwrite configuration files."
      )
    );
  }

  directoryOperations();
  fileOperations(forceMode);
}

function fileOperations(forceMode: boolean) {
  const fullConfigurationFilePath = path.join(
    CONFIGURATION_DIR,
    CONFIGURATION_FILE
  );

  createFileAsNeeded(fullConfigurationFilePath, forceMode);
  correctFilePermissionsAsNeeded(fullConfigurationFilePath);
}

function createFileAsNeeded(
  fullConfigurationFilePath: string,
  forceMode: boolean
) {
  const fileExists = fs.existsSync(fullConfigurationFilePath);
  if (fileExists) {
    console.log(chalk.red("Configuration file exists."));
  }

  if (!fileExists || forceMode) {
    if (forceMode && fileExists) {
      console.log(chalk.red("Removing existing configuration file."));
      fs.rmSync(fullConfigurationFilePath);
    }

    createFileFromTemplate(fullConfigurationFilePath);
  }
}

function createFileFromTemplate(fullConfigurationFilePath: string) {
  console.log(chalk.blue("Creating configuration file from template."));
  const fileFd = fs.openSync(
    fullConfigurationFilePath,
    fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_RDWR,
    CONFIGURATION_FILE_PERMISSIONS
  );

  fs.writeFileSync(fileFd, CONFIGURATION_FILE_TEMPLATE);
  fs.closeSync(fileFd);
}

function correctFilePermissionsAsNeeded(fullConfigurationFilePath: string) {
  console.log(chalk.blue("Checking configuration file permissions."));
  const fd = fs.openSync(fullConfigurationFilePath, "r");
  const stats = fs.fstatSync(fd);
  fs.closeSync(fd);

  const filePermissions = convertModeToPermissions(stats.mode);
  if (
    filePermissions !== convertModeToPermissions(CONFIGURATION_FILE_PERMISSIONS)
  ) {
    console.log(
      chalk.red(
        `Configuration file permissions incorrect. Currently: ${filePermissions} Fixing...`
      )
    );
    fs.chmodSync(fullConfigurationFilePath, CONFIGURATION_FILE_PERMISSIONS);
  }
}

function directoryOperations() {
  createDirectoryAsNeeded();
  correctDirectoryPermissionsAsNeeded();
}

function correctDirectoryPermissionsAsNeeded() {
  console.log(chalk.blue("Checking configuration directory permissions."));
  const dirFd = fs.openSync(CONFIGURATION_DIR, fs.constants.O_DIRECTORY);
  const dirStats = fs.fstatSync(dirFd);
  fs.closeSync(dirFd);

  const dirPermissions = convertModeToPermissions(dirStats.mode);
  if (
    dirPermissions !== convertModeToPermissions(CONFIGURATION_DIR_PERMISSIONS)
  ) {
    console.log(
      chalk.red(
        `Configuration directory permissions incorrect. Currently: ${dirPermissions} Fixing...`
      )
    );
    fs.chmodSync(CONFIGURATION_DIR, CONFIGURATION_DIR_PERMISSIONS);
  }
}

function createDirectoryAsNeeded() {
  const dirExists = fs.existsSync(CONFIGURATION_DIR);
  if (!dirExists) {
    console.log(chalk.blue("Creating configuration directory."));
    fs.mkdir(CONFIGURATION_DIR, CONFIGURATION_DIR_PERMISSIONS, (error) => {
      if (error) {
        console.error(chalk.red("Failed to create configuration directory."));
        throw error;
      }
    });
  } else {
    console.log(chalk.red("Configuration directory exists."));
  }
}
