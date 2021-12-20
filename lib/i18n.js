/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const ERRORS = {
  check_docs: 'Please check documentation: https://github.com/adobe/aem-site-template-builder',
  command_execute: 'Please check logs above. Error while executing command:',
  command_required: 'AEM Site Template Builder requires command to be available:',
  failed_to_read: 'Failed to read:',
  site_template_has_to_be_a_git: 'Site Template has to be a git repository!',
  theme_sources_not_found: 'Theme sources not found!'
};

const INFO = {
  check_prerequisite_end: 'Prerequisits check success!',
  check_prerequisite_start: 'Checking prerequisits...',
  content_package_build_end: 'Content package built successfully!',
  content_package_build_start: 'Building content package...',
  prepare_stub_start: 'Preparing stub...',
  prepare_stub_end: 'Stub ready!',
  prepare_stub_theme_sources: 'Preparing stub theme sources',
  prepare_stub_compiled_theme: 'Preparing stub theme',
  theme_compilation_end: 'Theme compiled successfully!',
  theme_compilation_start: 'Compiling theme...',
  theme_npm_install_end: 'NPM modules installed successfully!',
  theme_npm_install_start: 'Installing npm modules in theme...',
  theme_zip_end: 'Compiled theme zipped successfully',
  theme_zip_start: 'Zipping compiled theme...',
  start: 'AEM Site Template builder starts...',
  zip_package_end: 'Site Template .zip file created!',
  zip_package_start: 'Zipping Site Template package...',
  zip_theme_sources_end: 'Theme sources zipped successfully!',
  zip_theme_sources_start: 'Zipping Theme sources...',
};

module.exports = { INFO, ERRORS };
