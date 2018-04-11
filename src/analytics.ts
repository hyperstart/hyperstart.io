// fed from the config
declare const ENVIRONMENT
// fed from header script
declare const TRACK_ID
declare const gtag

export function log(name: string, parameters: any) {
  if (ENVIRONMENT === "prod") {
    gtag(name, TRACK_ID, parameters)
  }
}
