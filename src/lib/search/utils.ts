export interface Searches {
  [name: string]: number
}

function getCoeff(count: number, dampen: number) {
  return 1 / (1 + (count === 0 ? 0 : count - 1) / dampen)
}

function updateValue(searches: Searches, name: string, value: number): void {
  const old = searches[name]
  searches[name] = old && old > value ? old : value
}

export function normalize(text: string): string {
  if (!text || text === "") {
    return ""
  }

  return (
    text
      .trim()
      // replace non alphanumeric characters with a single dash
      .replace(/[^A-Za-z0-9@\/]+/g, "-")
      // insert a single dash between lower & upper case
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // lowercase what is left
      .toLowerCase()
  )
}

export function getWords(text: string): string[] {
  return normalize(text)
    .replace(/[@\/]/g, "-")
    .split("-")
    .filter(word => word !== "")
}

export function getSearches(name: string, keywords: string[] = []): Searches {
  const result: Searches = {}

  if (!name || name === "") {
    return result
  }

  const generated = getWords(name)

  // add the generated keywords
  let coeff = getCoeff(generated.length, 6)
  generated.forEach(name => {
    updateValue(result, name, 15 * coeff)
  })

  // add the user keywords
  coeff = getCoeff(keywords.length, 8)
  keywords.forEach(name => {
    updateValue(result, name, 15 * coeff)
  })

  // add the full title
  updateValue(result, generated.join("-"), 20)

  // for titles like "a-b-c-...", add "a-b" and "b-c"
  // also for "a/b", add "a-b"
  if (generated.length >= 2) {
    coeff = getCoeff(generated.length - 1, 10)
    for (let i = 0; i < generated.length - 1; i++) {
      updateValue(result, generated[i] + "-" + generated[i + 1], 15 * coeff)
    }
  }

  // remove incorrect entries
  Object.keys(result).forEach(key => {
    if (result[key] <= 0) {
      delete result[key]
    }
  })

  return result
}
