let hadError = false;

export function error(line: number, message: string): void {
  report(line, "", message);
}

function report(line: number, where: string, message: string) {
  console.error(`[line ${line}] Error ${where}: ${message}`);
  hadError = true;
}

export function checkForError() {
  return hadError;
}
export function recordError(error: boolean) {
  hadError = error;
}
