import { Token } from "./token";
import { Expr } from "./ast";
import { TokenType } from "./token-type";
import { error } from "./error";

export class Parser {
  private readonly tokens: Token[];
  current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr = this.comparison();

    while (this.match(TokenType.BangEqual, TokenType.BangEqual)) {
      expr = {
        left: expr,
        operator: this.previous(),
        right: this.comparison(),
      };
    }

    return expr;
  }

  private comparison(): Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual
      )
    ) {
      expr = { left: expr, operator: this.previous(), right: this.term() };
    }

    return expr;
  }

  private term(): Expr {
    let expr = this.factor();

    while (this.match(TokenType.Minus, TokenType.Plus)) {
      expr = { left: expr, operator: this.previous(), right: this.factor() };
    }

    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();

    while (this.match(TokenType.Slash, TokenType.Star)) {
      expr = { left: expr, operator: this.previous(), right: this.unary() };
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.Bang, TokenType.Minus)) {
      return { operator: this.previous(), right: this.unary() };
    }

    return this.primary();
  }

  private primary(): Expr {
    if (this.match(TokenType.False)) return { value: false };
    if (this.match(TokenType.True)) return { value: true };
    if (this.match(TokenType.Nil)) return { value: null };

    if (this.match(TokenType.Number, TokenType.String))
      return { value: this.previous().literal };

    if (this.match(TokenType.LeftParen)) {
      const expr = this.expression();
      this.consume(TokenType.RightParen, "Expect ')' after expression.");
      return { expression: expr };
    }
  }

  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();
    throw error(this.peek(), message);
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  private isAtEnd(): boolean {
    return this.peek().type == TokenType.Eof;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
