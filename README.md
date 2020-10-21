# AEM Site Template Builder

## What is it used for

AEM Site Template Builder is used for building `AEM Site Templates`.

## Prerequisite

In order to run AEM Site Template Builder you need to have installed on your machine:
- `mvn`
- `git`
- `zip`

Additionally you need to have access to sources of one of the `AEM Site Templates`.

## Installation

```
npm install [-g] @adobe/aem-site-template-builder
```

## Usage

To build your `AEM Site Template` just go into its folder and run command:

```
aem-site-template-builder
```

## Local development

For development purposes you can build local npm package which will provide `aem-site-template-builder` command. You need access to AEM Site Template Builder repository.

1. Clone AEM Site Template Builder repository.
2. ```cd aem-site-template-builder```
3. ```npm link```

Now you should have ```aem-site-template-builder``` command available globally as a command line. All changes that you will provide for the `aem-site-template-builder` script sources will get automatically applied to the linked command.

## What does it do exactly?

Script compiles `AEM Site Template` sources:
- `site.template`, 
- `site.theme`,
- `previews`,
- `files`,
- `package.json`
into final `.zip` package (site-template.zip).

AEM Site Template Builder will:
1. Compile theme.
2. Copy theme into content package.
3. Build content package.
4. Prepare Site Template structure.
5. Zip theme sources.
6. Copy all dependencies.
7. Zip Site Template package.
