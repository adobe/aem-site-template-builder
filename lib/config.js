/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const path = require('path');

function generatePaths (rootPath) {
  const theme = path.join(rootPath, 'theme');

  return {
    files: path.join(rootPath, 'files'),
    packageJson: path.join(rootPath, 'package.json'),
    previews: path.join(rootPath, 'previews'),
    root: rootPath,
    site: path.join(rootPath, 'site'),
    tempFolder: path.join(rootPath, 'site-template'),
    theme,
    themePackageJson: path.join(theme, 'package.json'),
    themeDist: path.join(theme, 'dist')
  };
};

module.exports.generatePaths = generatePaths;
