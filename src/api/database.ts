import request from '../utils/request'
import { Result } from './common'

interface Table {
  name: string
  rootpage: string
  sql: string
  tableName: string
}

interface Database {
  databaseName: string
  handle: string
  tables: Table[]
}

export const getDatabaseList = async (): Promise<Result<Database[]>> =>
  (await request.post('/api/hookSyncMsg')).data

export const executeSql = async (
  dbHandle: string,
  sql: string
): Promise<Result<null>> =>
  (await request.post('/api/executeSql', { dbHandle, sql })).data
