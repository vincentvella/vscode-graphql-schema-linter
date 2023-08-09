import fs from "fs";
import path from "path";
import { npm, yarn } from "global-dirs";
import vscode from "vscode";
import logger from "./logger";

const NOT_FOUND_MANUAL_ERROR = `
Manually entered global npm package path is invalid. 
Please check your settings. It should be the output of the "npm root -g" command.
If you are using yarn, it should be the output of the "yarn global dir" command.

If this seems to be correctly configured, attempt to reinstall the package.
npm i -g @gopuff/graphql-schema-linter
`;

interface Installation {
  path: string;
  location: "local" | "global";
}

// Find @gopuff/graphql-schema-linter library in node_modules
// Treats local-first (workspace folder) and global (yarn/npm) installations
export async function findInstallation(document: vscode.TextDocument): Promise<Installation | null> {
  const workspaceFolder = findWorkspaceFolder(document);
  if (!workspaceFolder) {
    return null;
  }

  let currentPath = document.fileName;
  const rootPath = workspaceFolder.uri.fsPath;

  // Check if the package is inside the workspace folder
  while (currentPath !== rootPath) {
    currentPath = path.dirname(currentPath);
    const libPath = path.join(currentPath, "node_modules", "@gopuff", "graphql-schema-linter");
    if (fs.existsSync(libPath)) {
      return {
        path: libPath,
        location: "local",
      };
    }
  }

  logger.debug("Could not find @gopuff/graphql-schema-linter in workspace folder.");

  // Check if the installation path was specified via the settings
  const globalNpmPackagePath = vscode.workspace
    .getConfiguration("vscode-graphql-schema-linter-gopuff")
    .get<string>("global-npm-package-path");
  if (globalNpmPackagePath) {
    const libPath = path.join(globalNpmPackagePath, "@gopuff", "graphql-schema-linter");
    if (fs.existsSync(libPath)) {
      logger.info(`Manually entered global npm packages path is being used: ${globalNpmPackagePath}`);
      return {
        path: libPath,
        location: "global",
      };
    } else {
      vscode.window.showErrorMessage(NOT_FOUND_MANUAL_ERROR, "Open Settings").then((value) => {
        if (value === "Open Settings") {
          vscode.commands.executeCommand("workbench.action.openSettings", "vscode-graphql-schema-linter-gopuff");
        }
      });
    }
  }

  const yarnPath = path.join(yarn.packages, "@gopuff", "graphql-schema-linter");
  const npmPath = path.join(npm.packages, "@gopuff", "graphql-schema-linter");

  // Check if the package is installed via yarn globally
  logger.debug(`Checking yarn path: ${yarnPath}`);
  if (fs.existsSync(yarnPath)) {
    // package is installed with global yarn
    return {
      path: yarnPath,
      location: "global",
    };
  }

  // Check if the package is installed via yarn globally
  logger.debug(`Checking npm path: ${npmPath}`);
  if (fs.existsSync(npmPath)) {
    // package is installed with global npm
    return {
      path: npmPath,
      location: "global",
    };
  }

  return null;
}

export function findWorkspaceFolder(document: vscode.TextDocument) {
  return vscode.workspace.getWorkspaceFolder(vscode.Uri.file(document.fileName));
}
