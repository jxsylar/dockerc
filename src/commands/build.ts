import { Args, Command, Flags } from '@oclif/core';

export default class Build extends Command {
  static args = {
    imageName: Args.string({
      description:
        'Docker 镜像名称, 支持带上版本号.\n默认读取 `package.json` 文件的 `name` 字段.',
      required: true,
    }),
  };

  static description = '构建 Docker 镜像';

  static examples = [
    '<%= config.bin %> <%= command.id %>                    # 使用 `package.json` 的 `name` 字段作为镜像名, `version` 字段作为镜像版本号',
    '<%= config.bin %> <%= command.id %> example            # 自定义镜像名, 使用 `package.json` 的 `version` 字段作为镜像版本号',
    '<%= config.bin %> <%= command.id %> --version 1.0.0    # 自定义镜像版本, 使用 `package.json` 的 `name` 字段作为镜像名',
    '<%= config.bin %> <%= command.id %> example:1.0.0            # 自定义镜像名和镜像版本',
    '<%= config.bin %> <%= command.id %> --file Dockerfile.conf   # 指定 Dockerfile 文件',
    '<%= config.bin %> <%= command.id %> example:1.0.0 --version 2.0.0   # 最终构建镜像版本号为 `2.0.0`',
  ];

  static flags = {
    file: Flags.string({
      default: 'Dockerfile',
      description: '`Dockerfile` 文件名',
    }),
    version: Flags.string({
      default: '0.0.0',
      description:
        'Docker 镜像版本号.\n默认读取 `package.json` 文件的 `version` 字段.',
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Build);
    console.log(args);
    console.log(flags);
  }
}
