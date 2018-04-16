interface Cache {
  [url: string]: string
}

const cache: Cache = {}

export function fetchSource(url: string): Promise<string> {
  if (typeof cache[url] === "string") {
    return Promise.resolve(cache[url])
  }

  return fetch(url)
    .then(res => res.text())
    .then(content => {
      cache[url] = content

      return content
    })
}
