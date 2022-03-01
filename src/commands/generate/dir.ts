import { Command, Flags } from '@oclif/core'
import { join } from 'path'
import { crawlDirectory } from '../../generator/generate-file'

export default class GenerateDir extends Command {
  static description =
    'Generate TS files for multiple BigQuery schemas with a single export file'

  static examples = [
    `$ bigquery-ts generate /path/to/schema.json --output /path/to/output/dir
`,
  ]

  static flags = {
    output: Flags.string({
      char: 'o',
      description: 'Where to write the generated files',
      required: false,
    }),
  }

  static args = [
    {
      name: 'directory',
      description: 'Directory where the schema files are located',
      required: true,
    },
  ]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GenerateDir)
    const createdFiles = crawlDirectory(
      args.directory,
      flags.output ?? join(args.directory, '__generated__')
    )
    for (const file of createdFiles) {
      this.log(file)
    }

    this.log(`---\nDone!`)
  }
}
