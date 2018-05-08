interface Cache {
  [url: string]: any
}

const cache: Cache = {}

export function fetchContentString(url: string): Promise<string> {
  if (typeof cache[url] !== "undefined") {
    return Promise.resolve(cache[url])
  }

  return fetch(url)
    .then(res => {
      if (res.status >= 400) {
        throw new Error(
          `Error while fetching ${url}, got ${res.status} with error: ${
            res.statusText
          }`
        )
      }

      return res.text()
    })
    .then(content => {
      cache[url] = content

      return content
    })
}

export function fetchContentJson(url: string): Promise<any> {
  if (typeof cache[url] !== "undefined") {
    return Promise.resolve(cache[url])
  }

  return fetch(url)
    .then(res => {
      if (res.status >= 400) {
        throw new Error(
          `Error while fetching ${url}, got ${res.status} with error: ${
            res.statusText
          }`
        )
      }

      return res.json()
    })
    .then(content => {
      cache[url] = content

      return content
    })
}
