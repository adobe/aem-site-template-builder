const test = require('ava');
const fs = require('fs').promises;

test('Readme contains link to expected structure of the repo which is used in error messages', async t => {
    const readme = await fs.readFile('README.md', 'utf8');
    t.assert(readme.includes('# Expected structure of the repository'));
});
