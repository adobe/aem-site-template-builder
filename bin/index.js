#!/usr/bin/env node

/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const path = require('path');
const shell = require('shelljs');
const zip = require('bestzip');
const colors = require('colors/safe');

const terminal = require('../lib/terminal');
const PATHS = require('../lib/config').paths;

/* Future command line arguments:
- config - path to config file which describes following arguments (default: none)
- path to starterkit (default: '.')
- name of the target content package 
- npm script for theme build which produces 'dist' folder (default: 'prod')
*/

// Check required commands in the terminal
terminal.commandCheck('mvn');
terminal.commandCheck('git');
terminal.commandCheck('zip');

shell.echo(terminal.prefix, 'Aem site theme builder script running...');

// Prepare site template folder
shell.echo(terminal.prefix, 'Preparing Site Template structure...');
shell.rm('-rf', PATHS.siteTemplate);
shell.rm('-rf', `${PATHS.siteTemplate}.zip`);
shell.mkdir('-p', PATHS.siteTemplate);

// Compile theme
shell.echo(terminal.prefix, 'Compiling theme...');
shell.cd(PATHS.theme);
shell.exec('npm install');
shell.exec('npm run prod');
shell.cd('..');

// Copy theme into content package
shell.echo(terminal.prefix, 'Populating theme to content...');
shell.cd(`${PATHS.theme}/dist`);
shell.exec('zip -r ../../site-template/site-theme.zip *');
shell.cd('../..');

// Build content package
shell.echo(terminal.prefix, 'Building content package...');
shell.cd(PATHS.template);
shell.exec('mvn clean install');
shell.cd('..');

// Copy all files into folder
shell.cp('-r', [PATHS.files, PATHS.previews, PATHS.properties], PATHS.siteTemplate);
shell.cp('-r', `${PATHS.template}/target/*.zip`, `${PATHS.siteTemplate}/site-template.zip`);

// Zip theme sources
shell.echo(terminal.prefix, 'Zipping Theme sources...');
shell.cd(PATHS.theme);
shell.exec(`zip ../${PATHS.siteTemplate}/theme-sources.zip $(git ls-files)`);
shell.cd('..');

// Zip Site Template package
shell.echo(terminal.prefix, 'Zipping Site Template package...');

zip({
  source: `*`,
  cwd: PATHS.siteTemplate,
  destination: path.join(process.cwd(), `${PATHS.siteTemplate}.zip`)
}).then(function() {
  shell.rm('-rf', 'site-template');
  shell.echo(terminal.prefix, `Site Template package created! ${PATHS.siteTemplate}.zip`);
}).catch(function(err) {
  shell.echo(colors.error(`[${terminal.packageName}]: Failed to zip Site Template package: ${err.stack}`));
  process.exit(1);
});
