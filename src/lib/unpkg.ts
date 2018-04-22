const URL = "https://unpkg.com/"

function getUrl(payload: GetPayload) {
  const { pkg, version, file } = payload
  let url = URL + pkg
  if (version) {
    url += "@" + version
  }
  if (file) {
    url += file.startsWith("/") ? file : "/" + file
  }

  return url
}

function extractFile(url: string): string {
  const segments = url.replace(URL, "").split("/")
  return url
    .replace(URL, "")
    .split("/")
    .slice(1)
    .join("/")
}

function extractVersion(url: string): string {
  const urlSegments = url.replace(URL, "").split("/")
  const segments = urlSegments[0].split("@")
  return segments[segments.length - 1]
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
      return response.text()
    })
    .then(content => {
      const file = payload.file || extractFile(url)
      const version = payload.version || extractVersion(url)
      return { content, url, pkg, file, version }
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
