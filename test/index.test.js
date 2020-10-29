const test = require('ava');
const path = require('path');
const fs = require('fs');

const ROOT_PATH = process.cwd();
const TEST_TEMPLATE_FOLDER_PATH = path.join(ROOT_PATH, 'test/resources/some-site-template');
const UNDER_TEST_PATH = path.join(ROOT_PATH, 'bin/index.js');

test.beforeEach(t => {
    process.chdir(TEST_TEMPLATE_FOLDER_PATH);
});

test.afterEach.always( async t => {
    process.chdir(ROOT_PATH);
    delete require.cache[require.resolve(UNDER_TEST_PATH)];
});

test('Create site template artifact', async t => {
    require(UNDER_TEST_PATH);

    // sleep for a few process cycles to await the childprocess in index.js
    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    t.true(fs.existsSync(path.join(TEST_TEMPLATE_FOLDER_PATH, 'some-site-template-1.0.0.zip')));
});
