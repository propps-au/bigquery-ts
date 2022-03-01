import { Command, Flags } from '@oclif/core'
import { basename, dirname } from 'path'
import { generateFile } from '../../generator/generate-file'
import { parse } from '../../parser/parser'

export default class Generate extends Command {
  static description = 'Generate TS files for a BigQuery schema'

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
      name: 'schema',
      description: 'BigQuery table schema JSON',
      required: true,
    },
  ]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate)
    this.log(`Parsing schema ${args.schema}`)
    const result = parse(args.schema)
    const folder = dirname(args.schema)
    const name = basename(args.schema, '.json')
    this.log(`Generating TS file for schema at ${name}`)
    const location = generateFile(name, flags.output ?? folder, result)
    this.log(`Wrote to file: ${location}`)
    this.log(`---\nDone!`)
  }
}
