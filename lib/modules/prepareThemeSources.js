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

const prepareThemeSources = async function ({ rootPath }) {
  const PATHS = config.generatePaths(rootPath);
  const TEMP_THEME_FOLDER_NAME = 'site-template-theme';
  const TEMP_THEME_FOLDER_PATH = path.join(PATHS.root, TEMP_THEME_FOLDER_NAME);
  const git = simpleGit(PATHS.root);
  const zipTheme = new AdmZip();

  const zipThemeSources = () => new Promise(resolve => {
    git.status((err, status) => {
      if (err) {
        terminal.error(err);
      }

      if (status.not_added.length === 0) terminal.error(ERRORS.theme_sources_not_found);

      const themeFiles = status.not_added.filter(filePath => filePath.indexOf(TEMP_THEME_FOLDER_NAME) > -1);

      if (themeFiles.length === 0) terminal.error(ERRORS.theme_sources_not_found);

      themeFiles.filter(Boolean).forEach(async (file) => {
        const sourceFilePath = path.join(PATHS.root, file).split(path.sep).filter((v, i, a) => a.indexOf(v) === i).join(path.sep);
        const destinationFilePath = sourceFilePath.slice(sourceFilePath.indexOf(TEMP_THEME_FOLDER_NAME));
        const destinationFolderPath = destinationFilePath.split(path.sep).slice(0, -1).join(path.sep);

        zipTheme.addLocalFile(sourceFilePath, destinationFolderPath);
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
