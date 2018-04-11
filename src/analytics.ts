// fed from the config
declare const ENVIRONMENT
// fed from header script
declare const TRACK_ID
declare const gtag

export function logConfig(parameters?: any) {
  if (ENVIRONMENT === "prod") {
    gtag("config", TRACK_ID, parameters)
  }
}

export function logEvent(action?: any, parameters?: any) {
  if (ENVIRONMENT === "prod") {
    gtag("event", action, parameters)
  }
}
