/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const path = require('path');
const AdmZip = require('adm-zip');

const config = require('../config');
const terminal = require('../terminal');
const { runShellCd, runShellExec } = require('../utils');
const { INFO } = require('../i18n');

const prepareCompiledTheme = async function ({ rootPath }) {
  const PATHS = config.generatePaths(rootPath);
  const zipTheme = new AdmZip();

  runShellCd(PATHS.theme);

  terminal.info(INFO.theme_npm_install_start);
  await runShellExec('npm install');
  terminal.success(INFO.theme_npm_install_end);

  terminal.info(INFO.theme_compilation_start);
  await runShellExec('npm run build');
  terminal.success(INFO.theme_compilation_end);

  terminal.info(INFO.theme_zip_start);
  zipTheme.addLocalFolder(PATHS.themeDist);
  zipTheme.writeZip(path.join(PATHS.tempFolder, 'theme.zip'));
  terminal.success(INFO.theme_zip_end);

  runShellCd(PATHS.root);
};

module.exports = prepareCompiledTheme;
