import { SourceMap } from "magic-string"

export function getName(actualId: string): string {
  const segments = actualId.split("/")
  return makeLegalIdentifier(segments[segments.length - 1])
}

const reservedWords = "break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public".split(
  " "
)
const builtins = "arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl".split(
  " "
)

let blacklisted = Object.create(null)
reservedWords.concat(builtins).forEach(word => (blacklisted[word] = true))

export function makeLegalIdentifier(str) {
  str = str
    .replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
    .replace(/[^$_a-zA-Z0-9]/g, "_")

  if (/\d/.test(str[0]) || blacklisted[str]) str = `_${str}`

  return str
}

const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/

const firstpassGlobal = /\b(?:require|module|exports|global)\b/
const firstpassNoGlobal = /\b(?:require|module|exports)\b/
const importExportDeclaration = /^(?:Import|Export(?:Named|Default))Declaration/
const importNamedDeclaration = /^(?:Import :Named)Declaration/

export function tryParse(parse, code, id) {
  try {
    return parse(code, { allowReturnOutsideFunction: true })
  } catch (err) {
    err.message += ` in ${id}`
    throw err
  }
}

export function checkFirstpass(code, ignoreGlobal) {
  const firstpass = ignoreGlobal ? firstpassNoGlobal : firstpassGlobal
  return firstpass.test(code)
}

export interface ModuleSource {
  code: string
  map: SourceMap
}
