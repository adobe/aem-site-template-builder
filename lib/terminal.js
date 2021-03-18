/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const colors = require('colors/safe');
const shell = require('shelljs');
const { ERRORS } = require('./i18n');

// set color theme
colors.setTheme({
  info: 'yellow',
  success: 'green',
  error: ['red', 'bold']
});

const packageName = 'aem-site-template-builder';

const error = function (message, exit = true) {
  shell.echo(colors.error(`[${packageName}]: ERROR! ${message}`));

  if (exit) {
    shell.echo(colors.error(`[${packageName}]: ${ERRORS.check_docs}`));
    process.exit(1);
  }
};

const info = function (message) {
  shell.echo(colors.info(`[${packageName}]:`), message);
};

const success = function (message) {
  shell.echo(colors.success(`[${packageName}]:`), message);
};

module.exports = {
  error, info, success
};
