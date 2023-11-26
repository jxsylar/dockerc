import { Args, Command, Flags } from '@oclif/core';

export default class Prod extends Command {
  static args = {
    service: Args.string({
      default: 'prod',
      description: 'Docker compose service',
    }),
  };

  static description = 'describe the command here';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    imageName: Flags.string({
      description: 'Docker image name',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Prod);
    console.log(args);
    console.log(flags);
  }
}
