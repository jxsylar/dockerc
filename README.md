# Docker Compose Wrapper CLI

CLI wrapper for docker build and run services based on `docker-compose.yaml` in frontend project.

The only thing we concern is the **dynamic version number**.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)



<!-- toc -->
* [Docker Compose Wrapper CLI](#docker-compose-wrapper-cli)
* [Prerequisites](#prerequisites)
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Integration](#integration)
* [.release-it.yaml](#release-ityaml)
* [omit other configuration](#omit-other-configuration)
* [Development](#development)
* [TODO](#todo)
<!-- tocstop -->

# Prerequisites

- Docker installed
- Docker compose installed - Can use `docker compose` command
- Docker Service started
- `docker-compose.yaml` file existed in cwd

# Features

- Image version existence check
- Use semver version
- Use `name` and `version` fields of `package.json` default

# Installation

```bash
npm i -g dockerc
```

# Usage

Assume that there is the following `Dockerfile` file:

```dockerfile
FROM nginx:1.24.0-alpine-slim

COPY --chown=nginx:nginx ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

ARG VERSION="v0.0.0"
ENV VERSION=${VERSION}
```

And the following `docker-compose.yaml` file:

```yaml
version: "3"
services:
  build:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: ${VERSION}
    image: ${IMAGE_NAME}:${VERSION}

  dev:
    image: nginx:1.24.0
    container_name: example-dev
    restart: unless-stopped
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/templates/default.conf.template
    ports:
      - 8080:80

  prod:
    image: ${IMAGE_NAME}:${VERSION}
    container_name: example-prod
    restart: unless-stopped
    ports:
      - 80:80
```

# Commands

<!-- commands -->
* [`dockerc build`](#dockerc-build)
* [`dockerc dev`](#dockerc-dev)
* [`dockerc help [COMMANDS]`](#dockerc-help-commands)
* [`dockerc prod`](#dockerc-prod)

## `dockerc build`

Build docker images with `build` service in `docker-compose.yaml` file.

```
USAGE
  $ dockerc build [--image <value>] [--no-export] [--version <value>]

FLAGS
  --image=<value>    Docker image name. Use the `name` field of the `package.json` file in CWD.
  --no-export        Don't export image after the docker build is successful.
  --version=<value>  Docker image version. Use the `version` field of the `package.json` file in CWD.

DESCRIPTION
  Build docker images with `build` service in `docker-compose.yaml` file.
  It will inject `IMAGE_NAME` and `VERSION` environment variables.

EXAMPLES
  $ dockerc build    # Use the `name` and `version` field of the `package.json` file in CWD.

  $ dockerc build --image example    # Specify image name

  $ dockerc build --version 1.0.0    # Specify image version
```

_See code: [src/commands/build.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/build.ts)_

## `dockerc dev`

Start `dev` service in `docker-compose.yaml` file.

```
USAGE
  $ dockerc dev

DESCRIPTION
  Start `dev` service in `docker-compose.yaml` file.

EXAMPLES
  $ dockerc dev
```

_See code: [src/commands/dev.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/dev.ts)_

## `dockerc help [COMMANDS]`

Display help for dockerc.

```
USAGE
  $ dockerc help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for dockerc.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `dockerc prod`

Start `prod` service in `docker-compose.yaml` file.

```
USAGE
  $ dockerc prod [--image <value>]

FLAGS
  --image=<value>  Docker image name. Use the `name` field of the `package.json` file in CWD.

DESCRIPTION
  Start `prod` service in `docker-compose.yaml` file.
  The docker image will be selected from the existing image list
  It will inject `IMAGE_NAME` and `VERSION` environment variables.

EXAMPLES
  $ dockerc prod    # Use the `name` field of the `package.json` file in CWD.

  $ dockerc prod --image example    # Specify image name
```

_See code: [src/commands/prod.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/prod.ts)_
<!-- commandsstop -->


# Integration

## [release-it](https://github.com/release-it/release-it)

```yaml
# .release-it.yaml
# omit other configuration
hooks:
  "after:release": "dockerc build --version ${version}"
```

# Development

## Clone the repository

```bash
git clone https://github.com/jxsylar/dockerc
```

## Install dependencies

```bash
pnpm i
```

Also, It will run `build` automatic. 

## Install CLI global

```bash
npm link
```

It will install to `$(npm prefix root -g)/bin/` folder, make sure this path is in `PATH` env.

Now you can use `dockerc` command in your shell:

```bash
docker
```

## Update

After code changed, build again:

```bash
pnpm run build
```

And the `dockerc` command will automatic use the latest version, which means you don't need to run `npm link` again.

## Document

Automatically update `README.md` by running:

```bash
pnpm run doc
```

Note: The command must run after building.

## Uninstall

```bash
npm unlink -g dockerc
```

This command can run in any path, which means you don't need to `cd` the project path.

# Reference

[Docker compose file variable interpolation](https://github.com/compose-spec/compose-spec/blob/master/spec.md#interpolation)

# TODO

- [ ] Plan to implement by go: In some extreme scenarios, we can't install online, so it would be better if it has binary version.
