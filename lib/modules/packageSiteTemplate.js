#!/usr/bin/env node

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

const terminal = require('../terminal');
const config = require('../config');
const { runShellExec } = require('../utils');
const { INFO } = require('../i18n');

const buildContentPackage = require('./buildContentPackage');
const prerequisitsCheck = require('./prerequisitsCheck');
const prepareCompiledTheme = require('./prepareCompiledTheme');
const prepareThemeSources = require('./prepareThemeSources');
const packageStub = require('./packageStub');

const isMacOS = process.platform === 'darwin';

const packageSiteTemplate = async function ({
  rootPath = process.cwd(),
  stub = false
}) {
  const PATHS = config.generatePaths(rootPath);
  terminal.success(INFO.start);

  await prerequisitsCheck({ rootPath });

  const packageJson = require(PATHS.packageJson);

  // Prepare site template temp folder
  shell.rm('-rf', PATHS.tempFolder);
  shell.mkdir('-p', PATHS.tempFolder);

  if (stub) {
    await packageStub({ rootPath });

    shell.cp('-r', [PATHS.packageJson], PATHS.tempFolder);
  } else {
    await prepareCompiledTheme({ rootPath });
    await prepareThemeSources({ rootPath });
    await buildContentPackage({ rootPath });

    // Copy all part of the Site Template into temp folder
    shell.cp('-r', [PATHS.files, PATHS.previews, PATHS.packageJson], PATHS.tempFolder);
    shell.cp('-r', `${PATHS.site}/target/*.zip`, `${PATHS.tempFolder}/site.zip`);
  }

  if (isMacOS) {
    // Clear .DS_Store files on Mac OS
    await runShellExec(`find ${PATHS.tempFolder} -name '.DS_Store' -delete`);
  }

  // Zip Site Template package
  terminal.info(INFO.zip_package_start);

  const siteTemplateFilePath = path.join(PATHS.root, `${packageJson.name}-${packageJson.version}${stub ? '-stub' : ''}.zip`);
  const siteTemplateZip = new AdmZip();

  siteTemplateZip.addLocalFolder(PATHS.tempFolder);
  siteTemplateZip.writeZip(siteTemplateFilePath);

  if (!stub) {
    const siteTemplateLatestPath = path.join(PATHS.root, `${packageJson.name}-latest.zip`);

    shell.cp('-r', siteTemplateFilePath, siteTemplateLatestPath);
  }

  // Remove site template temp folder
  shell.rm('-rf', PATHS.tempFolder);

  terminal.success(`${INFO.zip_package_end} ${siteTemplateFilePath}`);
};

module.exports = packageSiteTemplate;
