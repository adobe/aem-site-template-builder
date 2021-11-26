/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const walk = require('ignore-walk');

const config = require('../config');
const terminal = require('../terminal');
const { ERRORS, INFO } = require('../i18n');
const { runShellCd, runShellExec, shell } = require('../utils');

const packageStub = async function ({ rootPath } = {}) {
  const PATHS = config.generatePaths(rootPath);

  terminal.info(INFO.prepare_stub_start);

  if (!fs.existsSync(PATHS.theme) || !fs.existsSync(PATHS.themePackageJson)) {
    terminal.error(ERRORS.theme_sources_not_found);
  }

  stubThemeSources({ PATHS });
  await stubTheme({ PATHS });

  terminal.success(INFO.prepare_stub_end);
};

const stubThemeSources = function ({ PATHS }) {
  const zipThemeSources = new AdmZip();

  terminal.info(INFO.prepare_stub_theme_sources);

  const themeSourcesFiles = [
    PATHS.themePackageJson,
    path.join(PATHS.theme, 'README.md'),
    path.join(PATHS.theme, 'env_template')
  ];

  zipThemeSources.addFile(path.join('src', 'theme.scss'), '');
  zipThemeSources.addFile(path.join('src', 'theme.ts'), 'import "./theme.scss";');

  themeSourcesFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      terminal.error(`${ERRORS.theme_sources_not_found} Missing file: ${file}`);
    }

    const localPath = path.relative(PATHS.theme, file);

    // Path without the file name is required to not create folder with the file name
    const destinationFilePath = path.normalize(localPath).split(path.sep).slice(0, -1).join(path.sep);
    zipThemeSources.addLocalFile(file, destinationFilePath);
  });

  zipThemeSources.writeZip(path.join(PATHS.tempFolder, 'theme-sources.zip'));
};

const stubTheme = async function ({ PATHS }) {
  const zipTheme = new AdmZip();
  const tempDistPath = path.join(PATHS.tempFolder, 'dist');

  terminal.info(INFO.prepare_stub_compiled_theme);

  runShellCd(PATHS.theme);

  terminal.info(INFO.theme_npm_install_start);
  await runShellExec('npm install');
  terminal.success(INFO.theme_npm_install_end);

  terminal.info(INFO.theme_compilation_start);
  await runShellExec('npm run build');
  terminal.success(INFO.theme_compilation_end);

  shell.cp('-r', [PATHS.themeDist], PATHS.tempFolder);

  // TODO: do not generate map files in site template in the prod build
  const files = await walk({
    path: tempDistPath,
    ignoreFiles: ['.gitignore']
  });

  files.forEach((file) => {
    if (path.dirname(file) === '.') {
      fs.writeFileSync(path.join(tempDistPath, file), '');
      zipTheme.addLocalFile(path.join(tempDistPath, file));
    }
  });

  zipTheme.writeZip(path.join(PATHS.tempFolder, 'theme.zip'));

  shell.rm('-rf', tempDistPath);
};

module.exports = packageStub;
