import { pipe } from 'ramda'
import ts from 'typescript'
import { z } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import {
  IBigQueryFieldDefinitionRepeated,
  IBigQueryFieldDefinitionSchema,
  IBigQueryFieldDefinitionSingle,
} from '../../parser/schema'
import {
  BigQueryDateSchema,
  BigQueryDatetimeSchema,
  BigQueryTimeSchema,
  BigQueryTimestampSchema,
} from './bigquery-types'

const addField = (f: Field) => (schema: z.AnyZodObject) => schema.extend(f)

export function generate(schema: IBigQueryFieldDefinitionSchema[]): {
  type: string
  schema: z.AnyZodObject
  node: ts.TypeLiteralNode
} {
  const zodSchema = buildZodSchema(schema)
  const { node } = zodToTs(zodSchema)
  return {
    type: printNode(node),
    node: node as ts.TypeLiteralNode,
    schema: zodSchema,
  }
}

function buildZodSchema(
  schema: IBigQueryFieldDefinitionSchema[]
): z.AnyZodObject {
  const fields = schema.map((field) => generateField(field))
  const obj = z.object({})
  // @ts-ignore
  const apply = pipe(...fields.map((f) => addField(f)))
  return apply(obj)
}

type Field = { [key: string]: z.ZodSchema<any> }
function generateField(field: IBigQueryFieldDefinitionSchema): Field {
  switch (field.type) {
    case 'INT64':
    case 'FLOAT64':
    case 'NUMERIC':
    case 'BIGNUMERIC':
    case 'STRING':
    case 'BYTES':
    case 'BOOL':
    case 'TIMESTAMP':
    case 'DATE':
    case 'TIME':
    case 'DATETIME':
    case 'GEOGRAPHY':
      return generateSingleField(field)
    case 'RECORD':
      return generateRepeatedField(field)
    default:
      throw new Error(`Unknown type: ${field.type}`)
  }
}

function generateRepeatedField(field: IBigQueryFieldDefinitionRepeated) {
  const fields = field.fields.map((f) => generateField(f))
  const obj = z.object({})
  // @ts-ignore
  const construct = pipe(...fields.map((f) => addField(f)))
  return { [field.name]: applyMode(construct(obj), field.mode) }
}

function generateSingleField(field: IBigQueryFieldDefinitionSingle) {
  const type = buildSingleFieldType(field.type)
  return { [field.name]: applyMode(type, field.mode) }
}

function applyMode(
  field: SingleFieldType,
  mode?: IBigQueryFieldDefinitionSingle['mode']
) {
  switch (mode) {
    case 'NULLABLE':
      return field.optional()
    case 'REPEATED':
      return z.array(field)
    default:
      return field
  }
}

type SingleFieldType = ReturnType<typeof buildSingleFieldType>
function buildSingleFieldType(type: IBigQueryFieldDefinitionSingle['type']) {
  switch (type) {
    case 'INT64':
    case 'FLOAT64':
    case 'NUMERIC':
    case 'BIGNUMERIC':
      return z.number()
    case 'BOOL':
      return z.boolean()
    case 'TIMESTAMP':
      return BigQueryTimestampSchema
    case 'DATE':
      return BigQueryDateSchema
    case 'TIME':
      return BigQueryTimeSchema
    case 'DATETIME':
      return BigQueryDatetimeSchema
    case 'BYTES':
      return z.string()
    case 'STRING':
      return z.string()
    case 'STRUCT':
      return z.object({}).passthrough()
    default:
      throw new Error(`Unknown type: ${type}`)
  }
}
