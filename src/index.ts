#!/usr/bin/env node

import { program } from "commander";

import { eviction } from "./commands/eviction.js";
import { init } from "./commands/init.js";
import { validate } from "./commands/validate.js";

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
  .command("validate")
  .description("Validate the configuration file.")
  .action(validate);

await program.parseAsync();
