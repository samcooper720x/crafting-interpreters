import { readFileSync } from "fs";
import { createInterface } from "readline";
import { exit } from "process";
import { Scanner } from "./Scanner";
import { checkForError, recordError } from "./error";

export class Lox {
  main(args: string[]): void {
    if (args.length > 1) {
      console.log("Usage: lox [script]");
      exit(64);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private runFile(path: string): void {
    const src = readFileSync(path, "utf-8");
    Lox.run(src);
    if (checkForError()) exit(65);
  }

  private runPrompt(): void {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

    readline.prompt();
    readline.on("line", (input) => {
      Lox.run(input);
      readline.prompt();
      recordError(false);
    });
  }

  private static run(src: string): void {
    const scanner = new Scanner(src);
    const tokens = scanner.scanTokens();

    for (let token in tokens) {
      console.log(token);
    }
  }
}
