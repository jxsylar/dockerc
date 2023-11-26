# Docker Compose Wrapper CLI

CLI wrapper for docker build and run services based on `docker-compose.yaml` in frontend project.

The only thing we concern is the **dynamic version number**.

# Prerequisites

- Docker installed - Can use `docker` command
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

## 镜像构建

镜像构建默认使用 `Dockerfile` 文件, 确保存在 Dockerfile:

```dockerfile
FROM nginx:1.24.0-alpine-slim

COPY --chown=nginx:nginx ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

ARG VERSION="v0.0.0"
ENV VERSION=${VERSION}
```

Dockerfile 保留了 `VERSION` 参数, 构建时会传入版本号, 容器内部可以使用这个环境变量.

```bash
# 镜像名称默认读取 `package.json` 文件的 `name` 字段
docker-service build <image-name>

# 默认 `Dockerfile` 文件, 可使用 `--file` 参数指定 Dockerfile
docker-service build --file Dockerfile.conf

# 镜像版本号默认读取 `package.json` 文件的 `version` 字段, 可使用 `--version` 参数指定镜像版本
docker-service build --version 1.0.0
```

如果镜像版本已存在, 则会停止构建, 并抛出错误.

## 服务部署

镜像运行默认使用 `docker-compose.yaml` 文件:

```yaml
version: "3"
services:
  dev:
    image: nginx:1.24.0
    restart: unless-stopped
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/templates/default.conf.template
    ports:
      - 8082:80

  prod:
    # 占位符从环境变量里读取
    image: ${IMAGE_NAME}:${VERSION}
    restart: unless-stopped
    ports:
      - 8083:80
```

`docker-compose.yaml` 文件里定义了 `dev` 和 `prod` 两个 service, 服务部署时分为开发模式和生产模式.

`dev` 和 `prod` 模式区别: `dev` 模式使用固定镜像(如: 基镜像), `prod` 模式需要选择镜像版本

### 开发模式

```bash
# 默认使用 `dev` service
docker-service run-dev

# 可以自定义 dev service: `docker-compose.yaml` 需要定义 `development` service
docker-service run-dev development

# 默认使用 `docker-compose.yaml` 文件, 可使用 `--file` 参数指定配置文件
docker-service run-dev --file docker.compose.yaml
```

### 生产模式

```bash
# 镜像名称默认读取 `package.json` 文件的 `name` 字段
# 版本号从 CLI 提供的选项里选择
docker-service run-prod

# 可以自定义 prod service: `docker-compose.yaml` 需要定义 `production` service
docker-service run-prod production

# 可使用 `--image-name` 参数指定镜像名称
docker-service run-prod --image-name demo
```

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

## Uninstall

```bash
npm unlink -g dockerc
```

This command can run in any path, which means you don't need to `cd` the project path.

# TODO

- [ ] Plan to implement by go: In some extreme scenarios, we can't install online, so it would be better if it has binary version.


oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Docker Service](#docker-service)
* [背景](#背景)
* [特性](#特性)
* [前提条件](#前提条件)
* [安装](#安装)
* [使用方式](#使用方式)
* [默认 `Dockerfile` 文件, 可使用 `--file` 参数指定 Dockerfile](#默认-dockerfile-文件-可使用---file-参数指定-dockerfile)
* [镜像名称默认读取 `package.json` 文件的 `name` 字段, 可使用 `--name` 参数指定镜像名称](#镜像名称默认读取-packagejson-文件的-name-字段-可使用---name-参数指定镜像名称)
* [镜像版本号默认读取 `package.json` 文件的 `version` 字段, 可使用 `--version` 参数指定镜像版本](#镜像版本号默认读取-packagejson-文件的-version-字段-可使用---version-参数指定镜像版本)
* [默认使用 `dev` service](#默认使用-dev-service)
* [可以自定义 dev service: `docker-compose.yaml` 需要定义 `development` service](#可以自定义-dev-service-docker-composeyaml-需要定义-development-service)
* [默认使用 `docker-compose.yaml` 文件, 可使用 `--file` 参数指定配置文件](#默认使用-docker-composeyaml-文件-可使用---file-参数指定配置文件)
* [镜像名称默认读取 `package.json` 文件的 `name` 字段](#镜像名称默认读取-packagejson-文件的-name-字段)
* [版本号从 CLI 提供的选项里选择](#版本号从-cli-提供的选项里选择)
* [可以自定义 prod service: `docker-compose.yaml` 需要定义 `production` service](#可以自定义-prod-service-docker-composeyaml-需要定义-production-service)
* [可使用 `--image-name` 参数指定镜像名称](#可使用---image-name-参数指定镜像名称)
* [三方库集成](#三方库集成)
* [.release-it.yaml](#release-ityaml)
* [省略其他配置](#省略其他配置)
* [开发模式](#开发模式)
* [TODO](#todo)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g docker-service
$ docker-service COMMAND
running command...
$ docker-service (--version)
docker-service/0.0.0 darwin-x64 node-v18.17.1
$ docker-service --help [COMMAND]
USAGE
  $ docker-service COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`docker-service build [FILE]`](#docker-service-build-file)
* [`docker-service help [COMMANDS]`](#docker-service-help-commands)
* [`docker-service run-dev [FILE]`](#docker-service-run-dev-file)
* [`docker-service run-prod [FILE]`](#docker-service-run-prod-file)

## `docker-service build [FILE]`

describe the command here

```
USAGE
  $ docker-service build [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ docker-service build
```

_See code: [src/commands/build.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/build.ts)_

## `docker-service help [COMMANDS]`

Display help for docker-service.

```
USAGE
  $ docker-service help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for docker-service.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `docker-service run-dev [FILE]`

describe the command here

```
USAGE
  $ docker-service run-dev [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ docker-service run-dev
```

_See code: [src/commands/run-dev.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/run-dev.ts)_

## `docker-service run-prod [FILE]`

describe the command here

```
USAGE
  $ docker-service run-prod [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ docker-service run-prod
```

_See code: [src/commands/run-prod.ts](https://github.com/jxsylar/docker-service/blob/v0.0.0/src/commands/run-prod.ts)_
<!-- commandsstop -->
