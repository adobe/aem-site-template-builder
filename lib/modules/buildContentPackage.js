/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const shell = require('shelljs');

const config = require('../config');
const terminal = require('../terminal');
const { runShellExec } = require('../utils');
const { INFO } = require('../i18n');

const PATHS = config.paths;

const buildContentPackage = async function () {
  // Build content package
  terminal.info(INFO.content_package_build_start);
  shell.cd(PATHS.site);
  await runShellExec('mvn clean install');
  shell.cd(PATHS.root);
  terminal.success(INFO.content_package_build_end);
};

module.exports = buildContentPackage;
