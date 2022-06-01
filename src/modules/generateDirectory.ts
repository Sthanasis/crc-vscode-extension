import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateDirectoryOnUserClick(uri?: vscode.Uri) {
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
