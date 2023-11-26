import { Command, Flags } from '@oclif/core';

import {
  buildImage,
  confirmImageNotExists,
  exportImage,
  getImage,
} from '../utils/index.js';

export default class Build extends Command {
  static description = [
    'Build docker images with `build` service in `docker-compose.yaml` file.',
    'It will inject `IMAGE_NAME` and `VERSION` environment variables.',
  ].join('\n');

  static examples = [
    '<%= config.bin %> <%= command.id %>    # Use the `name` and `version` field of the `package.json` file in CWD.',
    '<%= config.bin %> <%= command.id %> --image example    # Specify image name',
    '<%= config.bin %> <%= command.id %> --version 1.0.0    # Specify image version',
  ];

  static flags = {
    image: Flags.string({
      description:
        'Docker image name. Use the `name` field of the `package.json` file in CWD.',
    }),
    'no-export': Flags.boolean({
      default: false,
      description: "Don't export image after the docker build is successful.",
    }),
    version: Flags.string({
      description:
        'Docker image version. Use the `version` field of the `package.json` file in CWD.',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Build);

    const image = getImage(flags.image, flags.version);
    confirmImageNotExists(image);
    buildImage(image);
    if (!flags['no-export']) {
      await exportImage(image);
    }
  }
}
