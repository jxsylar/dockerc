# Docker Compose Wrapper CLI

CLI wrapper for docker build and run services based on `docker-compose.yaml` in frontend project.

The only thing we concern is the **dynamic version number**.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)



<!-- toc -->

<!-- tocstop -->

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


<!-- usage -->

<!-- usagestop -->

# Commands
<!-- commands -->
<!-- commandsstop -->

## 镜像构建

镜像构建默认使用 `Dockerfile` 文件, 确保存在 Dockerfile:


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

