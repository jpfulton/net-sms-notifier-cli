#!/usr/bin/env node

import { program } from "commander";

import { eviction } from "./commands/eviction.js";

program
  .command("eviction")
  .argument("<serverName>", "Server name being evicted.")
  .description("Notify via SMS regarding a server eviction.")
  .action(eviction);

await program.parseAsync();
