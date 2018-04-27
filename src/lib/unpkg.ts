const URL = "https://unpkg.com/"

export interface GetUrlPayload {
  pkg: string
  version?: string
  file?: string
}

function prefix(prefix: string, value: string = "") {
  return value === ""
    ? value
    : value.startsWith(prefix)
      ? value
      : prefix + value
}

function getUrl({ pkg, version, file }: GetUrlPayload) {
  return URL + pkg + prefix("@", version) + prefix("/", file)
}

function extractVersion(url: string, pkg: string): string {
  return url.replace(getUrl({ pkg }) + "@", "").split("/", 1)[0]
}

function extractFile(url: string, pkg: string, version: string): string {
  return url.replace(getUrl({ pkg, version }), "")
}

export interface GetPayload {
  pkg: string
  version?: string
  file?: string
}

export interface GetResult {
  url: string
  content: string
  pkg: string
  version: string
  file: string
}

export function get(payload: GetPayload): Promise<GetResult> {
  const { pkg } = payload
  let url
  return fetch(getUrl(payload))
    .then(response => {
      url = response.url
      if (response.status !== 200) {
        return null
      }
      return response.text()
    })
    .then(content => {
      const version = payload.version || extractVersion(url, pkg)
      const file = payload.file || extractFile(url, pkg, version)
      return { content, url, pkg, file, version }
    })
}

export function getLatestVersion(pkg: string): Promise<string> {
  return fetch(getUrl({ pkg }), { method: "HEAD" }).then(res => {
    if (res.status !== 200) {
      throw new Error(`Package with name ${pkg} does not exist.`)
    }
    return extractVersion(res.url, pkg)
  })
}

export function exists(pkg: string): Promise<boolean> {
  return fetch(getUrl({ pkg }), { method: "HEAD" }).then(res => {
    return res.status === 200
  })
}

// function getMetaUrl(payload: GetMetaPayload) {
//   const { pkg, version } = payload
//   if (version) {
//     return URL + pkg + "@" + version + "/?meta"
//   }
//   return URL + pkg + "/?meta"
// }

// export interface GetMetaPayload {
//   pkg: string
//   version?: string
// }

// export function getMeta(payload: GetMetaPayload) {
//   return fetch(getMetaUrl(payload))
//     .then(response => response.json())
//     .then(json => {
//       console.log("Got meta", json)
//     })
// }
