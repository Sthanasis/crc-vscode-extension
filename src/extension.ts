// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ml-react-component-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId (generateReactComponent) parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'ml-react-component-generator.generateReactComponent',
    () => {
      // The code you place here will be executed every time your command is executed
      // Create a directory in the current workspace
      if (vscode.workspace.workspaceFolders) {
        const workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const workspace = vscode.workspace.getWorkspaceFolder(
          vscode.Uri.file(workspaceDir)
        );
        if (workspace) {
          generateDirectoryInCurrentWorkspace(workspace);
        } else {
          vscode.window.showErrorMessage('No workspace found');
        }
      } else {
        vscode.window.showErrorMessage('Workspace Directory is not found');
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function generateDirectoryInCurrentWorkspace(
  workspace: vscode.WorkspaceFolder
) {
  const componentName = await vscode.window.showInputBox({
    prompt: 'Component Name',
    placeHolder: 'MyComponent',
  });
  try {
    if (componentName) {
      const componentDirectory = path.join(workspace.uri.fsPath, componentName);
      fs.mkdirSync(componentDirectory);

      const componentIndexFile = path.join(componentDirectory, 'index.js');
      const componentNamedFile = path.join(
        componentDirectory,
        `${componentName}.js`
      );

      fs.writeFileSync(
        componentIndexFile,
        `export { default } from './${componentName}';`
      );
      fs.writeFileSync(
        componentNamedFile,
        `import React from 'react';\n\nconst ${componentName} = () => {\n  return <></>;\n};\n\nexport default ${componentName};`
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      'Something went wrong while creating the component!'
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
