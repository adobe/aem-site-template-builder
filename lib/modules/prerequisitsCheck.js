/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const simpleGit = require('simple-git');

const config = require('../config');
const terminal = require('../terminal');
const { ERRORS, INFO } = require('../i18n');

const prerequisitsCheck = async function ({ rootPath }) {
  const PATHS = config.generatePaths(rootPath);
  const THEME_PACKAGE_JSON_PATH = path.join(PATHS.theme, 'package.json');
  const git = simpleGit(PATHS.root);
  const requiredFiles = [PATHS.packageJson, THEME_PACKAGE_JSON_PATH];
  const checkGit = () => new Promise(resolve => {
    git.status(err => {
      if (err) terminal.error(ERRORS.site_template_has_to_be_a_git);
      resolve();
    });
  });
  const commandCheck = command => {
    if (!shell.which(command)) terminal.error(`${ERRORS.command_required} ${command}`);
  };

  terminal.info(INFO.check_prerequisite_start);

  commandCheck('mvn');
  commandCheck('git');
  commandCheck('zip');

  await checkGit();

  // Check if all required files are part of Site Template
  requiredFiles.filter(file => !fs.existsSync(file)).forEach((file, index, files) => {
    terminal.error(`${ERRORS.failed_to_read} ${file}`, index === files.length - 1);
  });

  terminal.success(INFO.check_prerequisite_end);
};

module.exports = prerequisitsCheck;
