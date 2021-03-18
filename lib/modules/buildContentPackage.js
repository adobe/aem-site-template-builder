/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const config = require('../config');
const terminal = require('../terminal');
const { runShellCd, runShellExec } = require('../utils');
const { INFO } = require('../i18n');

const buildContentPackage = async function ({ rootPath }) {
  const PATHS = config.generatePaths(rootPath);

  terminal.info(INFO.content_package_build_start);
  runShellCd(PATHS.site);
  await runShellExec('mvn clean install');
  runShellCd(PATHS.root);
  terminal.success(INFO.content_package_build_end);
};

module.exports = buildContentPackage;
