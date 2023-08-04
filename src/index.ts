#!/usr/bin/env node

import { program } from "commander";

import { eviction } from "./commands/eviction.js";
import { init } from "./commands/init.js";

program
  .command("eviction")
  .argument("<serverName>", "Server name being evicted.")
  .description("Notify via SMS regarding a server eviction.")
  .action(eviction);

program
  .command("init")
  .description("Create configuration directory and files.")
  .action(init);

await program.parseAsync();
