import fetch2 from "node-fetch"

export function fetch(url: string, options?: any): Promise<any> {
  return fetch2(url, options)
}
