#!/usr/bin/env node

const yargs = require('yargs/yargs');
const shell = require('shelljs');

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

// Compile theme - TODO: reuse aem-site-theme-builder script to compile theme 
shell.echo(terminal.prefix, 'Compiling theme...');
shell.cd('site.theme');
shell.exec('npm install');
shell.exec('npm run prod');
shell.cd('..');

// Copy theme into content package - TODO

// Build content package
shell.echo(terminal.prefix, 'Building content package...');
shell.cd('site.template');
shell.exec('mvn clean install');
shell.cd('..');

// Prepare site template folder
shell.echo(terminal.prefix, 'Preparing Site Template structure...');
shell.rm('-rf', PATHS.siteTemplate);
shell.rm('-rf', `${PATHS.siteTemplate}.zip`);
shell.mkdir('-p', PATHS.siteTemplate);

// Copy all files into folder
shell.cp('-r', [PATHS.files, PATHS.previews, PATHS.properties, 'site.template/target/*.zip' ], PATHS.siteTemplate);

// Zip theme sources
shell.echo(terminal.prefix, 'Zipping Theme sources...');
shell.cd('site.theme');
shell.exec(`zip ../${PATHS.siteTemplate}/theme-sources.zip $(git ls-files)`);
shell.cd('..');

// Zip Site Template package
shell.echo(terminal.prefix, 'Zipping Site Template package...');
shell.cd(PATHS.siteTemplate);
shell.exec(`bestzip ../${PATHS.siteTemplate}.zip *`);
shell.cd('..');

// Clear site template folder
shell.rm('-rf', 'site-template');
