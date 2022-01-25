import { Token } from "./Token";

export type Expr = {};
export type Binary = Expr & { left: Expr; operator: Token; right: Expr };
export type Grouping = Expr & { expression: Expr };
export type Literal = Expr & { value: Object };
export type Unary = Expr & { operator: Token; right: Expr };

const bin = getBinary();
