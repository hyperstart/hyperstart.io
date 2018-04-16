export interface CompilationResult {
  code: string
  map: any
  ast?: any
}

export interface Resolver {
  (importee: string, importer?: string): string | undefined | null
}
