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

const prepareThemeSources = require('../lib/modules/prepareThemeSources');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const THEME_SOURCES_FOLDER_PATH = path.join(TEST_TEMPLATE_FOLDER_PATH, 'site-template/theme-sources.zip');
const THEME_SOURCES_FOLDER_WRONG_PATH = path.resolve(ROOT_PATH, 'test/resources/incorrect-site-template');

process.on('exit', () => process.exit(0));

test.beforeEach(t => {
  shell.cd(ROOT_PATH);
});

test('prepare theme sources', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await prepareThemeSources({ rootPath: TEST_TEMPLATE_FOLDER_PATH });

  t.true(fs.existsSync(THEME_SOURCES_FOLDER_PATH));
});

test('fail if theme sources are not available in site template', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await prepareThemeSources({ rootPath: THEME_SOURCES_FOLDER_WRONG_PATH });

  // Terminal should throw error and exit process so it will not get to this check at all.
  t.true(false);
});
