import {
  BigQueryDate,
  BigQueryDatetime,
  BigQueryTime,
  BigQueryTimestamp,
} from '@google-cloud/bigquery'
import * as typescript from 'typescript'
import { z } from 'zod'
import { withGetType } from 'zod-to-ts'

export const BigQueryTimestampSchema = withGetType(
  z.instanceof(BigQueryTimestamp),
  (ts: typeof typescript) => ts.factory.createIdentifier('BigQueryTimestamp')
)

export const BigQueryDateSchema = withGetType(
  z.instanceof(BigQueryDate),
  (ts: typeof typescript) => ts.factory.createIdentifier('BigQueryDate')
)

export const BigQueryTimeSchema = withGetType(
  z.instanceof(BigQueryTime),
  (ts: typeof typescript) => ts.factory.createIdentifier('BigQueryTime')
)

export const BigQueryDatetimeSchema = withGetType(
  z.instanceof(BigQueryDatetime),
  (ts: typeof typescript) => ts.factory.createIdentifier('BigQueryDatetime')
)
