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
const AdmZip = require('adm-zip');

const packageSiteTemplate = require('../lib/modules/packageSiteTemplate');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const INCORRECT_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/incorrect-site-template');

test.beforeEach(t => {
  shell.cd(ROOT_PATH);
});

test('package Site Template', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  await packageSiteTemplate();

  t.true(fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'some-site-template-latest.zip')));
  t.true(fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'some-site-template-1.0.0.zip')));
});

test('package Site Template with rootPath', async t => {
  await packageSiteTemplate({ rootPath: TEST_TEMPLATE_FOLDER_PATH });

  t.true(fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'some-site-template-latest.zip')));
});

test('clear temp folder after build', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);

  t.true(!fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'site-template')));
});

test('compare structure of created package with pattern zip file', async t => {
  shell.cd(TEST_TEMPLATE_FOLDER_PATH);
  const siteTemplateZip = new AdmZip('some-site-template-latest.zip');
  const patternTemplateZip = new AdmZip('some-site-template-pattern.zip');

  const siteTemplateFiles = siteTemplateZip.getEntries().map(({ entryName }) => entryName);
  const patternTemplateFiles = patternTemplateZip.getEntries().map(({ entryName }) => entryName);

  t.true(JSON.stringify(siteTemplateFiles) === JSON.stringify(patternTemplateFiles));
});

test('packaging Site Template fails for incorrect Site Template', async t => {
  shell.cd(INCORRECT_TEMPLATE_FOLDER_PATH);
  await packageSiteTemplate({ rootPath: INCORRECT_TEMPLATE_FOLDER_PATH });

  t.true(!fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'some-site-template-latest.zip')));
});
