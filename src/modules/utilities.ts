import { FileExtensionType } from '../types';

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lowercaseTheFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const getComponentText = (str: FileExtensionType, filename: string) => {
  const map: { [key: string]: string } = {
    js: `import React from 'react';\n\nconst ${filename} = () => {\n  return <></>;\n};\n\nexport default ${filename};`,
    ts: `const ${filename} = ():JSX.Element => {\n  return <></>;\n};\n\nexport default ${filename};`,
  };

  return map[str];
};

export const getFileExtension = (e?: string): [string, FileExtensionType] => {
  let fileExtension = ['js', 'js'];
  if (e && e === 'typescript') {
    fileExtension = ['tsx', 'ts'];
  }
  return fileExtension as [string, FileExtensionType];
};
