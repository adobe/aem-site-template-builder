/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');

const { runShellCd } = require('../lib/utils');

process.on('exit', () => {
  console.log('on EXIT');
  process.exit(0);
});

test('test runShellCd on folder that does not exist', async t => {
  runShellCd('/this-folder-does-not-exist');

  // Terminal should exit process and not get to this check at all.
  t.true(false);
});
