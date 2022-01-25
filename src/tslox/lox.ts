import { readFileSync } from "fs";
import { createInterface } from "readline";
import { exit } from "process";
import { Scanner } from "./scanner";
import { checkForError, recordError } from "./error";

export class Lox {
  static main(args: string[]): void {
    if (args.length > 1) {
      console.log("Usage: lox [script]");
      exit(64);
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }

  private static runFile(path: string): void {
    const src = readFileSync(path, "utf-8");
    Lox.run(src);
    if (checkForError()) exit(65);
  }

  private static runPrompt(): void {
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

    tokens.forEach((token) =>
      console.log(`token type of ${token.type} and lexeme of ${token.lexeme}`)
    );
  }
}

Lox.main(process.argv.slice(2));
