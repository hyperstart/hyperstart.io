const URL = "https://unpkg.com/"

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

function getUrl(payload: GetPayload) {
  const { pkg, version, file } = payload
  // TODO finish
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

export function get(payload: GetPayload): Promise<GetResult> {
  const { pkg } = payload
  let url
  return fetch(URL + pkg)
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
