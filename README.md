# AEM Site Template Builder

This repository contains scripts for building `AEM Site Templates`.

## Installation

Required dependencies: `node`, `mvn`, `git`, `zip`

```bash
cd your-aem-site-template
npm install @adobe/aem-site-template-builder --save-dev
```

## Usage

To build your `AEM Site Template` just go into its folder and run command:

```bash
npx aem-site-template-builder
```

## Expected structure of the repository

```bash
files/                  Optional, folder with the UI kit XD file and possibly other files.
    design.xd
previews/               Folder with screenshots of the site template.
    buttons.png
    navigation.png
    teaser.png
site.template/          Content module that contains the templates and policies.
site.theme/             Theme sources (CSS, JS). It's a npm package with dev-dependency to aem-site-theme-builder.
package.json            Includes meta informations.
    - version           The version of the Site Template.
    - name              Unique name to help AEM to only contain a Site Template once.
    - title             Name of Site Template displayed in AEM UI.
    - description       Free-formed text that can contain some HTML like paragraphs, lists, links.
    - createdBy         Author or vendor.
    - useCases          List of strings that describe the purpose of the site template.
    - docsUrl
    - showcaseUrl
    - sourceRepositoryUrl
    - license
```

## Compiled site template artifact

```bash
files/                  Optional, folder with the UI kit XD file and possibly other files.
    design.xd
previews/               Folder with screenshots of the site template.
    buttons.png
    navigation.png
    teaser.png
site-template.zip       Content package that contains the templates and policies.
site-theme.zip          Contains compiled theme.
theme-sources.zip       Zipped theme sources folder.
```

## Local development

For development purposes you can build local npm package which will provide `aem-site-template-builder` command. You need access to AEM Site Template Builder repository.

1. Clone AEM Site Template Builder repository.
2. `cd aem-site-template-builder`
3. `npm link`

Now you should have `aem-site-template-builder` command available globally as a command line. All changes that you will provide for the `aem-site-template-builder` script sources will get automatically applied to the linked command.

## Release and publish

Run the "Release and publish" GitHub workflow and provide the semantic version you're about to release.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

## Licensing
This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.
