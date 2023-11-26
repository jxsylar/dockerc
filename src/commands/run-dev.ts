import { Args, Command, Flags } from '@oclif/core';

export default class RunDev extends Command {
  static args = {
    service: Args.string({
      default: 'dev',
      description: 'docker-compose 配置文件定义的服务名称',
    }),
  };

  static description =
    '使用 `docker-compose.yaml` 启动开发环境服务, 开发环境使用固定镜像';

  static examples = [
    '<%= config.bin %> <%= command.id %>               # 启用 `dev` 服务',
    '<%= config.bin %> <%= command.id %> development   # 启用 `development` 服务',
    '<%= config.bin %> <%= command.id %> --file docker.compose.yaml   # 自定义 docker-compose 配置文件',
    '<%= config.bin %> <%= command.id %> development --file docker.compose.yaml   # 指定自定义 docker-compose 配置文件, 并启动 development 服务',
  ];

  static flags = {
    file: Flags.string({
      default: 'docker-compose.yaml',
      description: '自定义 docker-compose 配置文件',
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(RunDev);
    console.log(args);
    console.log(flags);
  }
}
