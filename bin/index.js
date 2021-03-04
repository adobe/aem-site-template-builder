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

const terminal = require('../lib/terminal');
const config = require('../lib/config');
const { runShellExec } = require('../lib/utils');
const { INFO } = require('../lib/i18n');
const PATHS = config.paths;

const buildContentPackage = require('../lib/modules/buildContentPackage');
const prerequisitsCheck = require('../lib/modules/prerequisitsCheck');
const prepareCompiledTheme = require('../lib/modules/prepareCompiledTheme');
const prepareThemeSources = require('../lib/modules/prepareThemeSources');

(async () => {
  try {
    terminal.success(INFO.start);

    await prerequisitsCheck();

    // Prepare site template temp folder
    shell.rm('-rf', PATHS.tempFolder);
    shell.mkdir('-p', PATHS.tempFolder);

    await prepareCompiledTheme();
    await prepareThemeSources();
    await buildContentPackage();

    // Copy all part of the Site Template into temp folder
    shell.cp('-r', [PATHS.files, PATHS.previews, PATHS.properties], PATHS.tempFolder);
    shell.cp('-r', `${PATHS.site}/target/*.zip`, `${PATHS.tempFolder}/site.zip`);

    // Clear .DS_Store files
    await runShellExec(`find ${PATHS.tempFolder} -name ".DS_Store" -delete`);

    // Zip Site Template package
    terminal.info(INFO.zip_package_start);

    const { name, version } = require(PATHS.packageJson);
    const siteTemplateFilePath = path.join(PATHS.root, `${name}-${version}.zip`);
    const siteTemplateLatestPath = path.join(PATHS.root, `${name}-latest.zip`);
    const siteTemplateZip = new AdmZip();

    siteTemplateZip.addLocalFolder(PATHS.tempFolder);
    siteTemplateZip.writeZip(siteTemplateFilePath);

    shell.cp('-r', siteTemplateFilePath, siteTemplateLatestPath);

    shell.rm('-rf', PATHS.tempFolder);

    terminal.success(`${INFO.zip_package_end} ${siteTemplateFilePath}`);
  } catch (error) {
    console.log(error);
    terminal.error(error);
  }
})();
