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
    (url) => {
      // The code you place here will be executed every time your command is executed
      // Create a directory in the current workspace
      generateDirectoryOnUserClick(url);
    }
  );

  context.subscriptions.push(disposable);
}
function getCurrentWorkspacePath(): vscode.WorkspaceFolder | undefined {
  if (vscode.workspace.workspaceFolders) {
    const workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const workspace = vscode.workspace.getWorkspaceFolder(
      vscode.Uri.file(workspaceDir)
    );
    return workspace;
  }
  return undefined;
}

async function generateDirectoryOnUserClick(uri?: vscode.Uri) {
  try {
    let target: string | undefined;

    if (uri) {
      target = uri.fsPath;
    } else {
      target = getCurrentWorkspacePath()?.uri.fsPath;
    }

    const componentName = await vscode.window.showInputBox({
      prompt: 'Component Name',
      placeHolder: 'MyComponent',
    });

    if (!target) {
      vscode.window.showErrorMessage('Invalid path uri');
      return;
    }

    if (!componentName) {
      vscode.window.showErrorMessage('Invalid Component Name');
      return;
    }

    generateComponent(target, componentName);
  } catch (err) {
    vscode.window.showErrorMessage(
      'Something went wrong while creating the component!'
    );
  }
}

function generateComponent(targetPath: string, cmpName: string) {
  const componentDirectory = path.join(targetPath, cmpName);
  fs.mkdirSync(componentDirectory);

  const componentIndexFile = path.join(componentDirectory, 'index.js');
  const componentNamedFile = path.join(componentDirectory, `${cmpName}.js`);

  fs.writeFileSync(
    componentIndexFile,
    `export { default } from './${cmpName}';`
  );
  fs.writeFileSync(
    componentNamedFile,
    `import React from 'react';\n\nconst ${cmpName} = () => {\n  return <></>;\n};\n\nexport default ${cmpName};`
  );
}
// this method is called when your extension is deactivated
export function deactivate() {}
