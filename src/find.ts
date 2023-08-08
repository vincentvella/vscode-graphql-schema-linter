import fs from "fs";
import path from "path";
import globalDirs from "global-dirs";
import isPathInside from "is-path-inside";
import vscode from "vscode";

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

  // Check if the package is installed globally
  if (isPathInside(__dirname, globalDirs.yarn.packages)) {
    // package is installed with global yarn
    return {
      path: path.join(globalDirs.yarn.packages, "@gopuff", "graphql-schema-linter"),
      location: "global",
    };
  } else if (isPathInside(__dirname, globalDirs.npm.packages)) {
    // package is installed with global npm
    return {
      path: path.join(globalDirs.npm.packages, "@gopuff", "graphql-schema-linter"),
      location: "global",
    };
  }

  return null;
}

export function findWorkspaceFolder(document: vscode.TextDocument) {
  return vscode.workspace.getWorkspaceFolder(vscode.Uri.file(document.fileName));
}
