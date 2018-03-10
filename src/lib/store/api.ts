// # Queries

export type Operand = "<" | "<=" | "==" | ">=" | ">"

export interface Where {
  attribute: string
  op: Operand
  value: any
}

export interface OrderBy {
  attribute: string
  descending?: boolean
}

export interface GetByIdPayload {
  collection: string
  id: string
  refresh?: boolean
}

export interface QueryPayload {
  collection: string
  where?: Where[]
  orderBy?: OrderBy
  first?: any
  limit?: number
}

// # Updates

export interface DocumentToSet {
  collection: string
  id?: string
  document: any
}

export interface DocumentToUpdate {
  collection: string
  id: string
  document: any
}

export interface DocumentToDelete {
  collection: string
  id: string
}

export interface UpdatePayload {
  toSet?: DocumentToSet[]
  toUpdate?: DocumentToUpdate[]
  toDelete?: DocumentToDelete[]
}

export interface UpdatedDocument {
  collection: string
  id: string
  entity: any
}

export interface DeletedDocument {
  collection: string
  id: string
}

export interface UpdateResult {
  created: UpdatedDocument[]
  set: UpdatedDocument[]
  updated: UpdatedDocument[]
  deleted: DeletedDocument[]
}

// # Public Api

export interface Store {
  getById<T>(payload: GetByIdPayload): Promise<T>
  query<T>(payload: QueryPayload): Promise<T[]>
  update(updates: UpdatePayload): Promise<UpdateResult>
}
