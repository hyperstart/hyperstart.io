interface Cache {
  [url: string]: any
}

const cache: Cache = {}

export function fetchContentString(url: string): Promise<string> {
  if (typeof cache[url] !== "undefined") {
    return Promise.resolve(cache[url])
  }

  return fetch(url)
    .then(res => res.text())
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
    .then(res => res.json())
    .then(content => {
      cache[url] = content

      return content
    })
}
