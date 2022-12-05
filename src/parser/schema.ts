import { z } from 'zod'

interface IBigQueryFieldDefinitionBase {
  description?: string
  mode?: 'NULLABLE' | 'REQUIRED' | 'REPEATED'
  name: string
}

export interface IBigQueryFieldDefinitionSingle
  extends IBigQueryFieldDefinitionBase {
  type:
    | 'INT64'
    | 'FLOAT64'
    | 'NUMERIC'
    | 'BIGNUMERIC'
    | 'STRING'
    | 'BYTES'
    | 'BOOL'
    | 'BOOLEAN'
    | 'TIMESTAMP'
    | 'DATE'
    | 'TIME'
    | 'DATETIME'
    | 'GEOGRAPHY'
    | 'STRUCT'
}

export interface IBigQueryFieldDefinitionRecord
  extends IBigQueryFieldDefinitionBase {
  type: 'RECORD'
  fields: IBigQueryFieldDefinitionSchema[]
}

export type IBigQueryFieldDefinitionSchema =
  | IBigQueryFieldDefinitionSingle
  | IBigQueryFieldDefinitionRecord

const BigQueryFieldDefinitionBase = z.object({
  description: z.string().optional(),
  mode: z
    .union([
      z.literal('NULLABLE'),
      z.literal('REQUIRED'),
      z.literal('REPEATED'),
    ])
    .optional()
    .default('NULLABLE'),
  name: z.string(),
})

const BigQueryFieldDefinitionRecord: z.ZodSchema<IBigQueryFieldDefinitionRecord> =
  BigQueryFieldDefinitionBase.extend({
    type: z.literal('RECORD'),
    fields: z.array(z.lazy(() => BigQueryFieldDefinitionSchema)),
  })

const BigQueryFieldDefinitionGeneric: z.ZodSchema<IBigQueryFieldDefinitionSingle> =
  BigQueryFieldDefinitionBase.extend({
    type: z.union([
      z.literal('INT64'),
      z.literal('FLOAT64'),
      z.literal('NUMERIC'),
      z.literal('BIGNUMERIC'),
      z.literal('STRING'),
      z.literal('BYTES'),
      z.literal('BOOL'),
      z.literal('BOOLEAN'),
      z.literal('TIMESTAMP'),
      z.literal('DATE'),
      z.literal('TIME'),
      z.literal('DATETIME'),
      z.literal('GEOGRAPHY'),
      z.literal('STRUCT'),
    ]),
  })

export const BigQueryFieldDefinitionSchema: z.ZodSchema<IBigQueryFieldDefinitionSchema> =
  z.union([BigQueryFieldDefinitionGeneric, BigQueryFieldDefinitionRecord])

export const BigQueryTableSchema = z.array(BigQueryFieldDefinitionSchema)
