// eslint-disable-next-line node/no-missing-import
import { readFileSync } from 'node:fs'
import { BigQueryTableSchema, IBigQueryFieldDefinitionSchema } from './schema'

export function parse(filepath: string): IBigQueryFieldDefinitionSchema[] {
  const buffer = readFileSync(filepath)
  let json: any
  try {
    json = JSON.parse(buffer.toString())
  } catch {
    throw new Error('Failed to parse JSON')
  }

  return BigQueryTableSchema.parse(json)
}
