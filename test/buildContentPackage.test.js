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

const buildContentPackage = require('../lib/modules/buildContentPackage');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const TARGET_FILE_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template/site/target/some-content-0.0.1-SNAPSHOT.zip');

test('Build content package', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await buildContentPackage({ rootPath: TEST_TEMPLATE_FOLDER_PATH });

  t.true(fs.existsSync(TARGET_FILE_PATH));
});
