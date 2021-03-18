/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const test = require('ava');
const fs = require('fs').promises;

test('Readme contains link to expected structure of the repo which is used in error messages', async t => {
  const readme = await fs.readFile('README.md', 'utf8');
  t.assert(readme.includes('# Expected structure of the repository'));
});
