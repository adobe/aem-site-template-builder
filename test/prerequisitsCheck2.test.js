/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');
const path = require('path');

const prerequisitsCheck = require('../lib/modules/prerequisitsCheck');

const ROOT_PATH = process.cwd();
const WRONG_TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, '../');

process.on('exit', () => process.exit(0));

test('prerequisite check on site template which is not a git', async t => {
  await prerequisitsCheck({ rootPath: WRONG_TEST_TEMPLATE_FOLDER_PATH });

  // Error thrown - process stopped
  t.true(false);
});
