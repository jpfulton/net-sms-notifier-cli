#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";

import { eviction } from "./commands/eviction.js";
import { init } from "./commands/init.js";
import { restarted } from "./commands/restarted.js";
import { validate } from "./commands/validate.js";
import { vpnAttempt } from "./commands/vpn-attempt.js";
import { vpnConnection } from "./commands/vpn-connection.js";

if (process && process.getuid && process.getuid() !== 0) {
  console.error(
    chalk.red.bold("This utility needs to run as root or in a sudo context.")
  );
  console.error(
    chalk.red.bold(`Currently running as UID: ${process.getuid()}.`)
  );
  process.exit(1);
}

program.description(
  "A CLI for sending SMS notifications to system administrators."
);

program.exitOverride();

program
  .command("eviction")
  .argument("<serverName>", "Server name being evicted.")
  .description("Notify via SMS regarding a server eviction.")
  .action(eviction);

program
  .command("init")
  .option("-f, --force", "Overwrite existing configuration file if it exists.")
  .description("Create configuration directory and files.")
  .action(init);

program
  .command("restarted")
  .argument("<serverName>", "Server name being restarted.")
  .description("Notify via SMS regarding a server restart.")
  .action(restarted);

program
  .command("validate")
  .description("Validate the configuration file.")
  .action(validate);

program
  .command("vpn-attempt")
  .requiredOption("-i, --ip <ipAddress>", "Incoming IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Incoming certificate CN field."
  )
  .option(
    "-e, --certificateEmail <certificateEmailAddress>",
    "Incoming certificate emailAddress field."
  )
  .description("Notify via SMS regarding a VPN connection attempt.")
  .action(vpnAttempt);

program
  .command("vpn-connection")
  .requiredOption("-i, --ip <ipAddress>", "Incoming IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Incoming certificate CN field."
  )
  .description("Notify via SMS regarding a VPN connection success.")
  .action(vpnConnection);

try {
  program.parse();
} catch (error) {
  console.error(chalk.red.bold((error as Error).message));
  process.exit(1);
}
