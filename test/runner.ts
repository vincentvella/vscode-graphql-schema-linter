import { tmpdir } from "os";
import path from "path";

import { runTests } from "@vscode/test-electron";

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../");
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");
    const workspaceFolder = path.resolve(__dirname, "../../test/workspace");
    const workspaceGlobal = path.resolve(__dirname, "../../test/workspace-global");

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [workspaceFolder, "--disable-extensions", "--user-data-dir", `${tmpdir()}`],
      extensionTestsEnv: {
        DEBUG_MODE: "true",
      },
    });

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [workspaceGlobal, "--disable-extensions", "--user-data-dir", `${tmpdir()}`],
      extensionTestsEnv: {
        DEBUG_MODE: "true",
      },
    });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  }
}

main();
