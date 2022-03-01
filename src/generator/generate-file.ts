import camelcase from 'camelcase'
import { stripIndent } from 'common-tags'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs'
import * as path from 'path'
import { parse } from '../parser/parser'
import { IBigQueryFieldDefinitionSchema } from '../parser/schema'
import { generate } from './schema-to-ts/build-types'
import { processNode } from './ts-to-zod'

export function crawlDirectory(dir: string, outputDir: string) {
  const jsons = readdirSync(dir).filter(
    (file) => path.extname(file) === '.json'
  )

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const locations: string[] = []

  for (const filename of jsons) {
    const result = parse(path.join(dir, filename))
    const name = path.basename(filename, '.json')
    const location = generateFile(name, outputDir, result)
    locations.push(location)
  }

  const index = path.join(outputDir, 'index.ts')

  const content = locations
    .map((location) => `export * from './${path.basename(location, '.ts')}'`)
    .join('\n')

  writeFileSync(index, content)

  return [...locations, index]
}

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
