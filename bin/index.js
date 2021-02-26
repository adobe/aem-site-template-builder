#!/usr/bin/env node

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const zip = require('bestzip');
const colors = require('colors/safe');

const terminal = require('../lib/terminal');
const PATHS = require('../lib/config').paths;

const TEMP_FOLDER_NAME = 'site-template';
const SITE_TEMPLATE_PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const THEME_PACKAGE_JSON_PATH = path.join(process.cwd(), PATHS.theme, 'package.json');

const exitAndPrintError = (message) => {
  shell.echo(colors.error(`[${terminal.packageName}]: ${message}`));
  shell.echo(colors.error(`[${terminal.packageName}]: Docs about expected structure of the repo: https://github.com/adobe/aem-site-template-builder#expected-structure-of-the-repository`));
  process.exit(1);
};

// Check required package.json in site template root
if (!fs.existsSync(SITE_TEMPLATE_PACKAGE_JSON_PATH)) {
  exitAndPrintError(`Failed to read ${SITE_TEMPLATE_PACKAGE_JSON_PATH}.`);
}

// Check required package.json in site theme root
if (!fs.existsSync(THEME_PACKAGE_JSON_PATH)) {
  exitAndPrintError(`Failed to read ${THEME_PACKAGE_JSON_PATH}.`);
}

const siteTemplatePackageJson = require(SITE_TEMPLATE_PACKAGE_JSON_PATH);

// Check required commands in the terminal
terminal.commandCheck('mvn');
terminal.commandCheck('git');
terminal.commandCheck('zip');

shell.echo(terminal.prefix, 'Aem site theme builder script running...');

// Prepare site template folder
shell.echo(terminal.prefix, 'Preparing Site Template structure...');
shell.rm('-rf', TEMP_FOLDER_NAME);
shell.mkdir('-p', TEMP_FOLDER_NAME);

// Compile theme
shell.echo(terminal.prefix, 'Compiling theme...');
shell.cd(PATHS.theme);
shell.exec('npm install');
shell.exec('npm run build');
shell.cd('..');

// Copy compiled theme
shell.echo(terminal.prefix, 'Zipping compiled theme...');
shell.cd(`${PATHS.theme}/dist`);
shell.exec(`zip -r ../../${TEMP_FOLDER_NAME}/theme.zip *`);
shell.cd('../..');

// Build content package
shell.echo(terminal.prefix, 'Building content package...');
shell.cd(PATHS.site);
shell.exec('mvn clean install');
shell.cd('..');

// Copy all files into folder
shell.cp('-r', [PATHS.files, PATHS.previews, PATHS.properties], TEMP_FOLDER_NAME);
shell.cp('-r', `${PATHS.site}/target/*.zip`, `${TEMP_FOLDER_NAME}/site.zip`);

// Clear DS_Store files
shell.exec(`find ${TEMP_FOLDER_NAME} -name ".DS_Store" -delete`);

// Zip theme sources
shell.echo(terminal.prefix, 'Zipping Theme sources...');
shell.cd(PATHS.theme);
shell.exec(`zip ../${TEMP_FOLDER_NAME}/theme-sources.zip $(git ls-files)`);
shell.cd('..');

// Zip Site Template package
shell.echo(terminal.prefix, 'Zipping Site Template package...');

const siteTemplateFileName = `${siteTemplatePackageJson.name}-${siteTemplatePackageJson.version}.zip`;

zip({
  source: `*`,
  cwd: TEMP_FOLDER_NAME,
  destination: path.join(process.cwd(), siteTemplateFileName)
}).then(function() {
  const siteTemplateLatestName = `${siteTemplatePackageJson.name}-latest.zip`;
  // Create additional ${siteTemplateFileName}-latest.zip file as a copy of ${siteTemplateFileName}
  shell.cp('-r', path.join(process.cwd(), siteTemplateFileName), path.join(process.cwd(), siteTemplateLatestName));
  shell.rm('-rf', TEMP_FOLDER_NAME);
  shell.echo(terminal.prefix, `Site Template package created! ${siteTemplateFileName}`);
}).catch(function(err) {
  exitAndPrintError(`Failed to zip Site Template package: ${err.stack}`);
});
