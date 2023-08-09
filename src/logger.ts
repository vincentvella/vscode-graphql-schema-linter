import type { OutputChannel } from "vscode";
import vscode from "vscode";

const Logger: OutputChannel = vscode.window.createOutputChannel("GraphQL Schema Linter");

function error(message: string): void {
  Logger.appendLine(`[ERROR]: ${message}`);
}

function info(message: string): void {
  Logger.appendLine(`[INFO]: ${message}`);
}

function warn(message: string): void {
  Logger.appendLine(`[WARNING]: ${message}`);
}

function debug(message: string): void {
  Logger.appendLine(`[DEBUG]: ${message}`);
}

const logger = {
  debug,
  error,
  info,
  warn,
};

export default logger;
