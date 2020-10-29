const test = require('ava');
const path = require('path');
const fs = require('fs');

const TEST_TEMPLATE_FOLDER_PATH = path.join(process.cwd(), 'test/resources/some-site-template');
const UNDER_TEST_PATH = path.join(process.cwd(), 'bin/index.js');

test.beforeEach(t => {
    process.chdir(TEST_TEMPLATE_FOLDER_PATH);
});

test.afterEach.always( async t => {
    
    // sleep for a few process cycles to await the childprocess in index.js
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    process.chdir(TEST_TEMPLATE_FOLDER_PATH);
    delete require.cache[require.resolve(UNDER_TEST_PATH)];
});

test('Fail if package.json in site template root is not available', t => {
    const packageJsonPath = path.join(TEST_TEMPLATE_FOLDER_PATH, 'package.json');
    const __packageJsonPath = path.join(TEST_TEMPLATE_FOLDER_PATH, '__package.json');
    fs.renameSync(packageJsonPath, __packageJsonPath);
    process.on('exit', (code) => {
        t.assert(code, 1);
        // clean up
        fs.renameSync(__packageJsonPath, packageJsonPath);
        process.exit(0);
    });
    require(UNDER_TEST_PATH);
});

test('Create site template artifact', async t => {
    require(UNDER_TEST_PATH);
    
    // sleep for a few js cycles to await the childprocess in index.js
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    t.pass();
});
