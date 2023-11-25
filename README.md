# Docker Service

快速构建 Docker 镜像及运行 Docker 服务.

# 背景

在项目版本迭代过程中, 使用 Docker 发布时, 遇到以下问题:

- 版本迭代频繁, 频繁进行开发环境和生产环境部署
- 生产环境部署可能存在多个参数, 使用 `docker run` 容易忘记, 不方便管理, 可统一使用 `docker-compose.yaml` 管理, 但每次更新服务都需要修改 `docker-compose.yaml` 镜像版本

该项目解决以下问题:

- 通过维护 `docker-compose.yaml` 文件, 支持一键启动开发环境和生产环境, 不需要记住各种启动参数
- 每次更新服务, 不需要更新 `docker-compose.yaml` 文件, 可以通过 CLI 提供选项, 自行选择镜像版本

# 特性

- 镜像版本存在性校验
- 版本号使用 [semver](https://semver.org/) 规范管理
- 支持自定义扩展
- 提供 CLI 命令
- 支持编程运行
- 默认集成前端项目场景: 默认使用 `package.json` 的 `name` 和 `version` 字段

# 前提条件

- 已安装 Docker
- 已安装 Docker Compose
- 已启用 Docker 服务

# 安装

```bash
npm i -g docker-service
```

# 使用方式

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
docker-service build

# 默认 `Dockerfile` 文件, 可使用 `--file` 参数指定 Dockerfile
docker-service build --file Dockerfile.conf

# 镜像名称默认读取 `package.json` 文件的 `name` 字段, 可使用 `--name` 参数指定镜像名称
docker-service build --name custom-image-name

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
docker-service run-dev --name development

# 默认使用 `docker-compose.yaml` 文件, 可使用 `--file` 参数指定配置文件
docker-service run-dev --file docker.compose.yaml
```

### 生产模式

```bash
# 镜像名称默认读取 `package.json` 文件的 `name` 字段
# 版本号从 CLI 提供的选项里选择
docker-service run-prod

# 可以自定义 prod service: `docker-compose.yaml` 需要定义 `production` service
docker-service run-prod --name production

# 可使用 `--image-name` 参数指定镜像名称
docker-service run-prod --image-name demo
```

# 三方库集成

## 集成 [release-it](https://github.com/release-it/release-it)

```yaml
# .release-it.yaml
# 省略其他配置
hooks:
  "after:release": "docker-service build --version ${version}"
```

# 开发模式

```bash
pnpm i
```

本地全局安装:

```bash
npm -g link
```

这样本地修改后的, 使用全局命令执行的都是最新代码.

# TODO

- [ ] 镜像构建时, 支持 `docker build` 透传参数, 这意味着需要记住复杂的构建参数, 否则就违背了该项目的初衷(更简单地构建, 减少使用者负担), 目前还没想到更好地简单实现方式. 或者是否直接从 `docker-compose.yaml` 里直接构建镜像, 这样就可以将构建参数放在 `docker-compose.yaml` 里的, 这个需要研究一下, 如果可以, 就可以仅维护 `docker-compose.yaml` 文件即可.
- [ ] 提供 Go 实现, 提供二进制命令


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
