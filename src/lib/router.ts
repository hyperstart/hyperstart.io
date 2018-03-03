import { h, VNode } from "hyperapp"

/**
 * Utilities
 */

function clearSlashes(path: string) {
  return path.substring(
    path.startsWith("/") ? 1 : 0,
    path.length - (path.endsWith("/") ? 1 : 0)
  )
}

export interface Params {
  [key: string]: string
}

export interface Match {
  location: string
  path: String
  /** { [key: string]: string } */
  params: any
}

function getMatch(location: string, path: string, exact: boolean) {
  const params = {}
  if (location === path) {
    return { location, path, params }
  }

  if (path === "*") {
    return { location, path, params }
  }

  const locations = clearSlashes(location).split("/")
  const paths = clearSlashes(path).split("/")

  if (
    paths.length > locations.length ||
    (exact && paths.length < locations.length)
  ) {
    return null
  }

  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i]
    const loc = locations[i]
    if (segment.startsWith(":")) {
      params[segment.substring(1)] = loc
    } else if (segment !== "*" && segment !== loc) {
      return null
    }
  }

  return { location, path, params }
}

const LISTENERS = []

/**
 * Exports
 */

export interface State {
  location: string
}

export interface Actions {
  init()
  update()
}

export interface Module {
  state: State
  actions: Actions
}

export function create(): Module {
  return {
    state: {
      location: null
    },
    actions: {
      update: () => ({ location: window.location.pathname }),
      init: () => (_, actions) => {
        LISTENERS.push(actions.update)
        return { location: window.location.pathname }
      }
    }
  }
}

export function push(url) {
  history.pushState(null, null, url)
  LISTENERS.forEach(u => u())
}

export function back() {
  history.back()
  LISTENERS.forEach(u => u())
}

export function forward() {
  history.forward()
  LISTENERS.forEach(u => u())
}

export function replace(url) {
  history.replaceState(null, null, url)
  LISTENERS.forEach(u => u())
}

export function listen(path, listener, exact) {
  LISTENERS.push(() => {
    const result = getMatch(window.location.pathname, path, exact)
    if (result) {
      listener(result)
    }
  })
}

export function Link(props, children) {
  props.onclick = function(e) {
    if (
      e.button !== 0 ||
      e.altKey ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      props.target === "_blank" ||
      e.currentTarget.origin !== location.origin
    ) {
    } else {
      e.preventDefault()

      if (props.href !== location.pathname) {
        e.preventDefault()
        push(props.href)
      }
    }
  }

  return h("a", props, children)
}

export interface Route {
  path: string
  view: (props) => any
  exact?: boolean
  /**
   * any extra prop is passed to the view.
   */
  [key: string]: any
}

export interface RoutesProps {
  routes: Route[]
}

export function Routes(props: RoutesProps) {
  const { routes, ...rest } = props
  return routes.reduce((prev, next) => {
    if (prev) {
      return prev
    }
    const match = getMatch(location.pathname, next.path, next.exact)
    return match ? next.view({ ...rest, match }) : null
  }, null)
}
