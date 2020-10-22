/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const colors = require('colors/safe');
const shell = require('shelljs');

// set color theme
colors.setTheme({
  intro: ['green', 'bold'],
  verbose: 'cyan',
  data: 'grey',
  info: 'green',
  warn: 'yellow',
  debug: 'blue',
  error: ['red', 'bold']
});

const packageName = 'aem-site-template-builder';
const prefix = colors.intro(`[${packageName}]:`);

const commandCheck = function(command) {
  if (!shell.which(command)) {
    shell.echo(colors.error(`[${packageName}]: Sorry, this script requires "${command}" command to be available`));
    shell.exit(1);
  }
}

const terminal = {
  colors, commandCheck, packageName, prefix
};

module.exports = terminal;
