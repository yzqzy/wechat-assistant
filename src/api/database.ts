import request from '@/utils/request'
import { Result } from './common'

interface Table {
  name: string
  rootpage: string
  sql: string
  tableName: string
}

export interface Database {
  databaseName: string
  handle: number
  tables: Table[]
}

export const getDatabases = async (): Promise<Result<Database[]>> =>
  (await request.post('/api/getDBInfo')).data

export const execSql = async (
  dbHandle: number,
  sql: string
): Promise<Result<string[][]>> =>
  (await request.post('/api/execSql', { dbHandle, sql })).data
