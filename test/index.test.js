const test = require('ava');
const path = require('path');

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

test('Create site template artifact', async t => {
    require(path.join(cwd, 'bin/index.js'));
    t.pass();
});
