/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');

const { runShellExec } = require('../lib/utils');

process.on('exit', () => process.exit(0));

test('test runShellExec on command that does not exist', async t => {
  await runShellExec('this-command-does-not-exist');

  // Terminal should exit process and not get to this check at all.
  t.true(false);
});
