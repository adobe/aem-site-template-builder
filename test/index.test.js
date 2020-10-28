const test = require('ava');
const path = require('path');

test('Create site template artifact', async t => {
    const cwd = process.cwd();
    process.chdir(path.join(cwd, 'test/resources/some-site-template'));
    
    require(path.join(cwd, 'bin/index.js'));
    
    // sleep for a few js cycles to await the childprocess in index.js
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    process.chdir(cwd);
    t.pass();
});
