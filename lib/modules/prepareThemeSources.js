/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const path = require('path');
const shell = require('shelljs');
const AdmZip = require('adm-zip');
const simpleGit = require('simple-git');

const config = require('../config');
const terminal = require('../terminal');
const { ERRORS, INFO } = require('../i18n');

const PATHS = config.paths;

const prepareThemeSources = async function () {
  const TEMP_THEME_FOLDER_NAME = 'site-template-theme';
  const TEMP_THEME_FOLDER_PATH = path.join(PATHS.root, TEMP_THEME_FOLDER_NAME);
  const git = simpleGit(PATHS.root);
  const zipTheme = new AdmZip();

  const zipThemeSources = () => new Promise(resolve => {
    git.status((err, status) => {
      if (err) {
        throw err;
      }

      if (status.not_added.length === 0) terminal.error(ERRORS.theme_sources_not_found);

      const themeFiles = status.not_added.filter(filePath => filePath.split(path.sep)[0] === TEMP_THEME_FOLDER_NAME);

      if (themeFiles.length === 0) terminal.error(ERRORS.theme_sources_not_found);

      themeFiles.filter(Boolean).forEach(file => {
        const sourceFilePath = path.join(PATHS.root, file);
        const destinationFilePath = path.dirname(file).split(path.sep).slice(1).join(path.sep);

        return zipTheme.addLocalFile(sourceFilePath, destinationFilePath);
      });

      zipTheme.writeZip(path.join(PATHS.tempFolder, 'theme-sources.zip'));

      resolve();
    });
  });

  terminal.info(INFO.zip_theme_sources_start);
  shell.cp('-r', PATHS.theme, TEMP_THEME_FOLDER_PATH);
  await zipThemeSources();
  shell.rm('-rf', TEMP_THEME_FOLDER_PATH);
  terminal.success(INFO.zip_theme_sources_end);
};

module.exports = prepareThemeSources;
