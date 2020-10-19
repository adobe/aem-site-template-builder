#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const shell = require('shelljs');
const clientlib = require("aem-clientlib-generator");
const zip = require('bestzip');
const colors = require('colors/safe');

const terminal = require('../lib/terminal');
const PATHS = require('../lib/config').paths;
const clientlibConfig = require(path.join(process.cwd(), 'clientlib.config.js'));

if(clientlibConfig) {
  clientlibConfig.libs.map(config => {
    if(!config.path) config.path = clientlibConfig.clientLibRoot;
  })
}

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

// Create clientlibs
shell.echo(terminal.prefix, 'Creating clientlibs...');
clientlib(clientlibConfig.libs, { verbose: true }, function () {
  shell.echo(terminal.prefix, 'Clientlibs properly generated!');

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

  zip({
    source: `*`,
    cwd: PATHS.siteTemplate,
    destination: path.join(process.cwd(), `../${PATHS.siteTemplate}.zip`)
  }).then(function() {
    shell.rm('-rf', 'site-template');
    shell.echo(terminal.prefix, `Site Template package: ${PATHS.siteTemplate}.zip`);
  }).catch(function(err) {
    shell.echo(colors.error(`[${terminal.packageName}]: Failed to zip Site Template package: ${err.stack}`));
    process.exit(1);
  });
});
