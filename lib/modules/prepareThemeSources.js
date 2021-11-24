/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const walk = require('ignore-walk');

const config = require('../config');
const terminal = require('../terminal');
const { ERRORS, INFO } = require('../i18n');

const prepareThemeSources = async function ({ rootPath } = { rootPath: process.cwd() }) {
  const PATHS = config.generatePaths(rootPath || process.cwd());
  const zipTheme = new AdmZip();

  terminal.info(INFO.zip_theme_sources_start);

  if (!fs.existsSync(PATHS.theme)) {
    terminal.error(ERRORS.theme_sources_not_found);
  }

  const files = await walk({
    path: PATHS.theme,
    ignoreFiles: ['.gitignore']
  });

  if (files.length === 0) terminal.error(ERRORS.theme_sources_not_found);

  files.forEach((file) => {
    const sourceFilePath = path.join(PATHS.theme, file);
    // Path without the file name is required to not create folder with the file name
    const destinationFilePath = path.normalize(file).split(path.sep).slice(0, -1).join(path.sep);
    zipTheme.addLocalFile(sourceFilePath, destinationFilePath);
  });

  zipTheme.writeZip(path.join(PATHS.tempFolder, 'theme-sources.zip'));

  terminal.success(INFO.zip_theme_sources_end);
};

module.exports = prepareThemeSources;
