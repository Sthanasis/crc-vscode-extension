import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import {
  capitalize,
  getComponentText,
  getFileExtension,
  lowercaseTheFirstLetter,
} from './utilities';

function generateComponent(
  targetPath: string,
  cmpName: string,
  ext?: string,
  css?: string
) {
  const [cmpExt, fileExt] = getFileExtension(ext);

  const capitalizedName = capitalize(cmpName);
  const lowerCasedName = lowercaseTheFirstLetter(capitalizedName);

  const componentDirectory = path.join(targetPath, capitalizedName);
  fs.mkdirSync(componentDirectory);

  const indexFile = path.join(componentDirectory, `index.${fileExt}`);
  const namedFile = path.join(
    componentDirectory,
    `${capitalizedName}.${cmpExt}`
  );

  const testFile = path.join(
    componentDirectory,
    `${lowerCasedName}.test.${cmpExt}`
  );

  fs.writeFileSync(
    indexFile,
    `export { default } from './${capitalizedName}';`
  );
  fs.writeFileSync(namedFile, getComponentText(fileExt, capitalizedName));

  fs.writeFileSync(testFile, `/* Write the test cases here! */`);
  if (css && css !== 'none') {
    const cssFile = path.join(componentDirectory, `${lowerCasedName}.${css}`);
    fs.writeFileSync(cssFile, '/* Styles go here */');
  }
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
    if (!target) {
      vscode.window.showErrorMessage('Invalid path uri');
      return;
    }

    const componentName = await vscode.window.showInputBox({
      prompt: 'Component Name',
      placeHolder: 'MyComponent',
    });

    const extension = await vscode.window.showQuickPick([
      'javascript',
      'typescript',
    ]);
    const includeCss = await vscode.window.showQuickPick([
      'css',
      'scss',
      'none',
    ]);

    if (!componentName) {
      vscode.window.showErrorMessage('Invalid Component Name');
      return;
    }

    generateComponent(target, componentName.trim(), extension, includeCss);
  } catch (err) {
    console.log(err);
    vscode.window.showErrorMessage(
      'Something went wrong while creating the component!'
    );
  }
}

export default generateDirectoryOnUserClick;
