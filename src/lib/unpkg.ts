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
      if (response.status >= 400) {
        throw new Error(
          `Error while downloading File ${url}, got response: ${
            response.status
          }: ${response.statusText}`
        )
      }
      return response.text()
    })
    .then(content => {
      const version = extractVersion(url, pkg)
      const file = extractFile(url, pkg, version)
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
