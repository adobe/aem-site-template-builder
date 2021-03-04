/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const shell = require('shelljs');
const AdmZip = require('adm-zip');

const config = require('../config');
const terminal = require('../terminal');
const { runShellExec } = require('../utils');
const { INFO } = require('../i18n');

const PATHS = config.paths;

const prepareCompiledTheme = async function () {
  const zipTheme = new AdmZip();

  shell.cd(PATHS.theme);

  terminal.info(INFO.theme_npm_install_start);
  await runShellExec('npm install');
  terminal.success(INFO.theme_npm_install_end);

  terminal.info(INFO.theme_compilation_start);
  await runShellExec('npm run build');
  terminal.success(INFO.theme_compilation_end);

  terminal.info(INFO.theme_zip_start);
  zipTheme.addLocalFolder(PATHS.themeDist);
  zipTheme.writeZip(PATHS.tempFolder);
  terminal.success(INFO.theme_zip_end);

  shell.cd(PATHS.root);
};

module.exports = prepareCompiledTheme;
