interface TransformOptions {
  ast?: boolean
  presets?: string[]
}

interface TransformOutput {
  code: string
  map: any
  ast: any
}

interface BabelApi {
  transform(code: string, options: TransformOptions): TransformOutput
}

declare const Babel: BabelApi

// see https://github.com/babel/babel/tree/master/packages/babel-standalone
