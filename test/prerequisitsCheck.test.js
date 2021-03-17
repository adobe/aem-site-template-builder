/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');
const path = require('path');
const shell = require('shelljs');

const prerequisitsCheck = require('../lib/modules/prerequisitsCheck');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const INCORRECT_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/incorrect-site-template');

test.beforeEach(t => {
  shell.cd(ROOT_PATH);
});

test('prerequisite check on proper site template', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await prerequisitsCheck({ rootPath: TEST_TEMPLATE_FOLDER_PATH });

  // No errors thrown - process still going
  t.true(true);
});

test('prerequisite check on incorrect site template', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await prerequisitsCheck({ rootPath: INCORRECT_TEMPLATE_FOLDER_PATH });

  // Error thrown - process stopped
  t.true(false);
});
