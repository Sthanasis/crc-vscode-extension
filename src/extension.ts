// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'ml-react-component-generator.Generate-React-Component',
    () => {
      // The code you place here will be executed every time your command is executed
      // Create a directory in the current workspace
      const workspace = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor?.document.uri as vscode.Uri
      );
      if (workspace) {
        generateDirectoryInCurrentWorkspace(workspace);
      } else {
        vscode.window.showErrorMessage('No workspace found');
      }
    }
  );

  context.subscriptions.push(disposable);
}

function generateDirectoryInCurrentWorkspace(
  workspace: vscode.WorkspaceFolder
) {
  const fs = require('fs');
  const path = require('path');
  const componentName = vscode.window.showInputBox({
    prompt: 'Component Name',
    placeHolder: 'MyComponent',
  });
  const componentDirectory = path.join(workspace.uri.fsPath, componentName);
  fs.mkdirSync(componentDirectory);

  const componentIndexFile = path.join(componentDirectory, 'index.js');
  const componentNamedFile = path.join(componentName, `${componentName}.js`);

  fs.writeFileSync(
    componentIndexFile,
    `export { default } from './${componentNamedFile}';`
  );
  fs.writeFileSync(
    componentNamedFile,
    `import React from 'react';

	   const ${componentName} = () => {
		   return <></>;
	   };
	   
	   export default ${componentName};	 
	  `
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
