import { TokenType } from "./token-type";

export class Token {
  type: TokenType;
  lexeme: string;
  literal: object;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
