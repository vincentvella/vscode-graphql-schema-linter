import vscode from "vscode";
import { findInstallation, findWorkspaceFolder } from "./find";
import logger from "./logger";

type SchemaLinterError = {
  message: string;
  location: {
    line: number;
    column: number;
    file: string;
  };
  rule: string;
};

// Map<filePath, vscode.Diagnostic[]>
export type LintResult = Map<string, vscode.Diagnostic[]>;

export async function runGraphqlSchemaLinter(document: vscode.TextDocument): Promise<LintResult | undefined> {
  logger.debug("Running @gopuff/graphql-schema-linter...");
  const installation = await findInstallation(document);
  const installationPath = installation?.path ?? null;

  logger.debug(`Installation path: ${installationPath}`);

  if (installationPath === null) {
    logger.error("@gopuff/graphql-schema-linter is not installed.");
    throw new Error("@gopuff/graphql-schema-linter is not installed.");
  }

  const { runner } = await import(installationPath);

  const stdout = createStdio();
  const stderr = createStdio();
  const stdin = null;

  const argv = ["node", "_", "--format", "json", "--installation-path", installationPath];
  const configDirectory = findWorkspaceFolder(document);
  if (configDirectory) {
    logger.info(`Using config directory: ${configDirectory.uri.fsPath}`);
    argv.push("--config-directory", configDirectory.uri.fsPath);
  }
  const exitCode = await runner.run(stdout, stdin, stderr, argv);

  if (exitCode === 0) {
    return new Map();
  }

  if (exitCode !== 1) {
    throw new Error(stderr.data || "@gopuff/graphql-schema-linter failed.");
  }

  const errors: SchemaLinterError[] = JSON.parse(stdout.data).errors;
  const result: LintResult = new Map();

  errors.forEach((error) => {
    const { message, location, rule } = error;
    const { line, column, file: filePath } = location;

    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(line - 1, column - 1, line - 1, column - 1),
      message,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.source = "graphql-schema-linter";
    diagnostic.code = rule;

    result.set(filePath, (result.get(filePath) || []).concat(diagnostic));
  });

  return result;
}

function createStdio() {
  return {
    data: "",
    write(_data: string) {
      this.data = _data;
      return true;
    },
    on(_: string, cb: () => void) {
      cb();
    },
  };
}
