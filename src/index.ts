#!/usr/bin/env node

import chalk from "chalk";
import { CommanderError, program } from "commander";

import { eviction } from "./commands/eviction.js";
import { init } from "./commands/init.js";
import { restarted } from "./commands/restarted.js";
import { validate } from "./commands/validate.js";
import { vpnClientFirewallTestFail } from "./commands/vpn-client-fw-test-fail.js";
import { vpnConnection } from "./commands/vpn-connection.js";
import { vpnDisconnection } from "./commands/vpn-disconnection.js";
import { vpnUnauthorizedAttempt } from "./commands/vpn-unauthorized-attempt.js";
import { INVALID_CONFIGURATION_ERROR_CODE } from "./utils/configuration.js";

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

program.showHelpAfterError();

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
  .command("vpn-bad-attempt")
  .requiredOption("-i, --ip <ipAddress>", "Incoming IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Incoming certificate CN field."
  )
  .description("Notify via SMS regarding a bad VPN connection attempt.")
  .action(vpnUnauthorizedAttempt);

program
  .command("vpn-client-fw-test-fail")
  .requiredOption("-i, --ip <ipAddress>", "Incoming IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Incoming certificate CN field."
  )
  .description("Notify via SMS regarding a VPN client firewall test fail.")
  .action(vpnClientFirewallTestFail);

program
  .command("vpn-connection")
  .requiredOption("-i, --ip <ipAddress>", "Trusted IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Trusted certificate CN field."
  )
  .description("Notify via SMS regarding a VPN connection success.")
  .action(vpnConnection);

program
  .command("vpn-disconnection")
  .requiredOption("-i, --ip <ipAddress>", "Trusted IP address.")
  .requiredOption(
    "-n, --certificateCN <certificateCN>",
    "Trusted certificate CN field."
  )
  .description("Notify via SMS regarding a VPN disconnection.")
  .action(vpnDisconnection);

try {
  await program.parseAsync();
} catch (error) {
  if (error instanceof CommanderError) {
    const commanderError = error as CommanderError;

    if (commanderError.code === INVALID_CONFIGURATION_ERROR_CODE) {
      console.log(chalk.red.bold(commanderError.message));
    } else if (commanderError.code !== "commander.help") {
      console.error(chalk.red.bold(commanderError.message));
    }

    process.exit(commanderError.exitCode);
  } else {
    console.error(chalk.red.bold((error as Error).message));
    process.exit(1);
  }
}
