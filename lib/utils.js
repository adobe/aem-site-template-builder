/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const fs = require('fs');
const shell = require('shelljs');
const terminal = require('./terminal');
const { ERRORS } = require('./i18n');

async function runShellExec (command) {
  return new Promise(resolve => {
    shell.exec(command, { async: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        terminal.error(`${ERRORS.command_execute} ${command}`);
      }
      resolve();
    });
  });
}

function runShellCd (path) {
  if (fs.existsSync(path)) {
    shell.cd(path);
  } else {
    terminal.error(`Folder does not exist: ${path}`);
  }
}

module.exports = {
  runShellCd,
  runShellExec,
  shell
};
