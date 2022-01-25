import { TokenType } from "./token-type";
import { Token } from "./token";
import { error } from "./error";

export class Scanner {
  source: string;
  tokens: Token[];

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
  }

  private start = 0;
  private current = 0;
  private line = 1;

  private keywords = {
    and: TokenType.And,
    class: TokenType.Class,
    else: TokenType.Else,
    false: TokenType.False,
    for: TokenType.For,
    fun: TokenType.Fun,
    if: TokenType.If,
    nil: TokenType.Nil,
    or: TokenType.Or,
    print: TokenType.Print,
    return: TokenType.Return,
    super: TokenType.Super,
    this: TokenType.This,
    true: TokenType.True,
    var: TokenType.Var,
    while: TokenType.While,
  };

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.Eof, "", null, this.line));
    return this.tokens;
  }

  private scanToken(): void {
    const c: string = this.advance();

    switch (c) {
      case "(":
        this.addToken(TokenType.LeftParen);
        break;
      case ")":
        this.addToken(TokenType.RightParen);
        break;
      case "{":
        this.addToken(TokenType.LeftBrace);
        break;
      case "}":
        this.addToken(TokenType.RightBrace);
        break;
      case ",":
        this.addToken(TokenType.Comma);
        break;
      case ".":
        this.addToken(TokenType.Dot);
        break;
      case "-":
        this.addToken(TokenType.Minus);
        break;
      case "+":
        this.addToken(TokenType.Plus);
        break;
      case ";":
        this.addToken(TokenType.Semicolon);
        break;
      case "*":
        this.addToken(TokenType.Star);
        break;
      case "!":
        this.addToken(this.match("=") ? TokenType.BangEqual : TokenType.Bang);
        break;
      case "=":
        this.addToken(this.match("=") ? TokenType.EqualEqual : TokenType.Equal);
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LessEqual : TokenType.Less);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GreaterEqual : TokenType.Greater
        );
        break;
      case "/":
        if (this.match("/")) {
          // A comment goes until the end of the line.
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.Slash);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace.
        break;
      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (Scanner.isDigit(c)) {
          this.number();
        } else if (Scanner.isAlpha(c)) {
          this.identifier();
        } else {
          error(this.line, "Unexpected character.");
          break;
        }
    }
  }

  private identifier(): void {
    while (Scanner.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    const type = this.keywords[text];
    this.addToken(type == null ? TokenType.Identifier : type);
  }

  private number(): void {
    while (Scanner.isDigit(this.peek(0))) this.advance();

    // Look for a fractional part.
    if (this.peek(0) == "." && Scanner.isDigit(this.peek(1))) {
      // Consume the '.'
      this.advance();

      while (Scanner.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.Number,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  private string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) return error(this.line, "Unterminated string");

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.String, value);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private peek(range = 0): string {
    if (this.isAtEnd(this.current + range)) return "\0";
    return this.source.charAt(this.current);
  }

  private static isAlpha(c: string): boolean {
    return (c.toLowerCase() >= "a" && c.toLowerCase() <= "z") || c == "_";
  }

  private static isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private static isAlphaNumeric(c: string): boolean {
    return Scanner.isAlpha(c) || Scanner.isDigit(c);
  }

  private isAtEnd(c: number = this.current): boolean {
    return c >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal: Object = null): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
