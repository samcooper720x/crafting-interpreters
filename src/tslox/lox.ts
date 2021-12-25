import { readFileSync } from "fs";
import { createInterface } from "readline";
import { exit } from "process";

class Lox {
  hadError = false;

  main(args: Array<string>): void {
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
    this.run(src);
    if (this.hadError) exit(65);
  }

  private runPrompt(): void {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

    readline.prompt();
    readline.on("line", (input) => {
      this.run(input);
      readline.prompt();
      this.hadError = false;
    });
  }

  private run(src: string): void {
    const scanner = Scanner(src);
    const tokens = scanner.scanTokens();

    for (let token in tokens) {
      console.log(token);
    }
  }

  private error(line: number, message: string): void {
    this.report(line, "", message);
  }

  private report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }
}
