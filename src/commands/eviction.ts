import chalk from "chalk";

export async function eviction(serverName: string): Promise<void> {
  console.log(chalk.blue.bold(`Eviction function called for ${serverName}.`));
}
