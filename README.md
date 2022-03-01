# @propps/bigquery-ts

Create Typescript type definitions and Zod schemas based on BigQuery table JSON schemas.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/@propps/bigquery-ts)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/@propps/bigquery-ts)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/propps-au/bigquery-ts/blob/main/package.json)

<!-- toc -->
* [@propps/bigquery-ts](#proppsbigquery-ts)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @propps/bigquery-ts
$ bigquery-ts COMMAND
running command...
$ bigquery-ts (--version)
@propps/bigquery-ts/0.2.0 darwin-arm64 node-v16.13.1
$ bigquery-ts --help [COMMAND]
USAGE
  $ bigquery-ts COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bigquery-ts generate:dir DIRECTORY`](#bigquery-ts-generatedir-directory)
* [`bigquery-ts generate:file SCHEMA`](#bigquery-ts-generatefile-schema)
* [`bigquery-ts help [COMMAND]`](#bigquery-ts-help-command)
* [`bigquery-ts plugins`](#bigquery-ts-plugins)
* [`bigquery-ts plugins:inspect PLUGIN...`](#bigquery-ts-pluginsinspect-plugin)
* [`bigquery-ts plugins:install PLUGIN...`](#bigquery-ts-pluginsinstall-plugin)
* [`bigquery-ts plugins:link PLUGIN`](#bigquery-ts-pluginslink-plugin)
* [`bigquery-ts plugins:uninstall PLUGIN...`](#bigquery-ts-pluginsuninstall-plugin)
* [`bigquery-ts plugins:update`](#bigquery-ts-pluginsupdate)

## `bigquery-ts generate:dir DIRECTORY`

Generate TS files for multiple BigQuery schemas with a single export file

```
USAGE
  $ bigquery-ts generate:dir [DIRECTORY] [-o <value>]

ARGUMENTS
  DIRECTORY  Directory where the schema files are located

FLAGS
  -o, --output=<value>  Where to write the generated files

DESCRIPTION
  Generate TS files for multiple BigQuery schemas with a single export file

EXAMPLES
  $ bigquery-ts generate /path/to/schema.json --output /path/to/output/dir
```

_See code: [dist/commands/generate/dir.ts](https://github.com/propps-au/bigquery-ts/blob/v0.2.0/dist/commands/generate/dir.ts)_

## `bigquery-ts generate:file SCHEMA`

Generate a single TS file for a BigQuery schema

```
USAGE
  $ bigquery-ts generate:file [SCHEMA] [-o <value>]

ARGUMENTS
  SCHEMA  BigQuery table schema JSON

FLAGS
  -o, --output=<value>  Where to write the generated files

DESCRIPTION
  Generate a single TS file for a BigQuery schema

EXAMPLES
  $ bigquery-ts generate /path/to/schema.json --output /path/to/output/dir
```

_See code: [dist/commands/generate/file.ts](https://github.com/propps-au/bigquery-ts/blob/v0.2.0/dist/commands/generate/file.ts)_

## `bigquery-ts help [COMMAND]`

Display help for bigquery-ts.

```
USAGE
  $ bigquery-ts help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bigquery-ts.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `bigquery-ts plugins`

List installed plugins.

```
USAGE
  $ bigquery-ts plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bigquery-ts plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `bigquery-ts plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bigquery-ts plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bigquery-ts plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/inspect.ts)_

## `bigquery-ts plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bigquery-ts plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ bigquery-ts plugins:add

EXAMPLES
  $ bigquery-ts plugins:install myplugin 

  $ bigquery-ts plugins:install https://github.com/someuser/someplugin

  $ bigquery-ts plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/install.ts)_

## `bigquery-ts plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ bigquery-ts plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ bigquery-ts plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/link.ts)_

## `bigquery-ts plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bigquery-ts plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bigquery-ts plugins:unlink
  $ bigquery-ts plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/uninstall.ts)_

## `bigquery-ts plugins:update`

Update installed plugins.

```
USAGE
  $ bigquery-ts plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/update.ts)_
<!-- commandsstop -->
