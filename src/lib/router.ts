import { h, VNode } from "hyperapp"

// # Utilities

export function toAbsolute(base: string, relative: string): string {
  const stack = base.split("/")
  const parts = relative.split("/")

  stack.pop()
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] == ".") continue
    if (parts[i] == "..") stack.pop()
    else stack.push(parts[i])
  }
  return stack.join("/")
}

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

// # Interceptors

const INTERCEPTORS = []

const intercept = (url: string): boolean =>
  INTERCEPTORS.reduce((prev, interceptor) => prev && interceptor(url), true)

window.onpopstate = e => {
  const allowed = intercept(window.location.href)
  if (!allowed) {
    e.preventDefault()
    e.stopImmediatePropagation()
    history.go(1)
  }
}

export interface RouteChangeInterceptor {
  /**
   * return false if prevent route change
   */
  (newUrl: string): boolean
}

export function addInterceptor(interceptor: RouteChangeInterceptor): void {
  INTERCEPTORS.push(interceptor)
}

export function removeInterceptor(interceptor: RouteChangeInterceptor): void {
  const index = INTERCEPTORS.findIndex(i => i === interceptor)
  if (index >= 0) {
    INTERCEPTORS.splice(index)
  }
}

// # Listeners

const LISTENERS = []

export function listen(path, listener, exact) {
  LISTENERS.push(() => {
    const result = getMatch(window.location.pathname, path, exact)
    if (result) {
      listener(result)
    }
  })
}

// # Module

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

// # Navigation functions

export function push(url) {
  if (intercept(url)) {
    history.pushState(null, null, url)
    LISTENERS.forEach(u => u())
  }
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
  if (intercept(url)) {
    history.replaceState(null, null, url)
    LISTENERS.forEach(u => u())
  }
}

// # Components

// ## Link

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

// ## Routes

export interface Route {
  path: string
  view: (props) => any
  exact?: boolean
}

export interface RoutesProps {
  routes: Route[]
  routeProps?: any
}

export function Routes(props: RoutesProps) {
  const { routes, routeProps = {} } = props
  return routes.reduce((prev, next) => {
    if (prev) {
      return prev
    }
    const match = getMatch(location.pathname, next.path, next.exact)
    return match ? next.view({ ...routeProps, match }) : null
  }, null)
}
