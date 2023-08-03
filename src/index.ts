#!/usr/bin/env node

import { program } from "commander";

import { eviction } from "./commands/eviction.js";

program
  .command("eviction")
  .option("-s|--serverName", "Server name")
  .description("Notify regarding a server eviction.")
  .action(eviction);

await program.parseAsync();
