/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');

const terminal = require('../lib/terminal');

test('test terminal error without ending process', async t => {
  terminal.error('test error - do not end process', false);

  t.true(true);
});

test('test terminal error with ending process', async t => {
  terminal.error('test error - end process');

  // Terminal should close process and not get to this check at all.
  t.true(false);
});
