#!/usr/bin/env node

/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const packageSiteTemplate = require('../lib/modules/packageSiteTemplate');
const yargs = require('yargs');

const cmd = yargs
  .scriptName('aem-site-template-builder')
  .command(['serve', '$0'], 'build', () => {}, async function () {
    await packageSiteTemplate({ rootPath: process.cwd() });
  })
  .command('stub', 'stub', () => {}, async function () {
    await packageSiteTemplate({ rootPath: process.cwd(), stub: true });
  })
  .help()
  .argv;
