#!/usr/bin/env node

/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const packageSiteTemplate = require('../lib/modules/packageSiteTemplate');

(async () => {
  await packageSiteTemplate({ rootPath: process.cwd() });
})();
