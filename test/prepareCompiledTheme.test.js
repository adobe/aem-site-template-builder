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
const fs = require('fs');

const prepareCompiledTheme = require('../lib/modules/prepareCompiledTheme');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const THEME_FOLDER_PATH = path.join(TEST_TEMPLATE_FOLDER_PATH, 'site-template/theme.zip');

test.beforeEach(t => {
  shell.cd(ROOT_PATH);
});

test('prepare compiled theme', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await prepareCompiledTheme({ rootPath: TEST_TEMPLATE_FOLDER_PATH });

  t.true(fs.existsSync(THEME_FOLDER_PATH));
});
