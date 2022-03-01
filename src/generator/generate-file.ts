import camelcase from 'camelcase'
import { stripIndent } from 'common-tags'
import { writeFileSync } from 'fs'
import * as path from 'path'
import { IBigQueryFieldDefinitionSchema } from '../parser/schema'
import { generate } from './schema-to-ts/build-types'
import { processNode } from './ts-to-zod'

export function generateFile(
  name: string,
  destination: string,
  definition: IBigQueryFieldDefinitionSchema[]
): string {
  const { type, node } = generate(definition)

  const label = camelcase(name, { pascalCase: true })

  const header = `
  import {
    BigQueryDate,
    BigQueryDatetime,
    BigQueryTime,
    BigQueryTimestamp,
  } from '@google-cloud/bigquery'
  import { z } from 'zod'

  const BigQueryTimestampSchema = z.instanceof(BigQueryTimestamp)
  const BigQueryDateSchema = z.instanceof(BigQueryDate)
  const BigQueryTimeSchema = z.instanceof(BigQueryTime)
  const BigQueryDatetimeSchema = z.instanceof(BigQueryDatetime)
  `

  const zodSchema = processNode(node, label)

  const typeDef = `export type ${label} = ${type}`

  const contents = [header, zodSchema, typeDef]
    .map((x) => stripIndent(x))
    .join('\n\n')

  const location = path.join(destination, `${label}.ts`)

  writeFileSync(location, contents)
  return location
}
