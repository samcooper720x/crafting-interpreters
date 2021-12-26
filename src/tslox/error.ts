let hadError = false;

export function error(line: number, message: string): void {
  report(line, "", message);
}

function report(line: number, where: string, message: string): void {
  console.error(`[line ${line}] Error ${where}: ${message}`);
  hadError = true;
}

export function checkForError(): boolean {
  return hadError;
}
export function recordError(error: boolean): void {
  hadError = error;
}
