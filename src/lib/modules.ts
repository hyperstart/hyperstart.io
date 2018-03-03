export interface Module<State = any, Actions = any> {
  state: State
  actions: Actions
}

/*

export interface Modules {
  [name: string]: Module
}

export function combine(modules: Modules, root?: Module): Module {
  const state = root ? root.state : {}
  const actions = root ? root.actions : {}

  for (let name in modules) {
    state[name] = modules[name].state || {}
    actions[name] = modules[name].actions || {}
  }

  return { state, actions }
}
*/

interface Mod<State = any, Actions = any> {
  modules: {
    [key: string]: Mod
  }
  state: State
  actions: Actions
}

type MergedModule<Module extends Mod> = {
  state: {
    // TODO
  }
  actions: {
    // TODO
  }
}

export type ActionResult<State> = Partial<State> | Promise<any> | null | void

export type ActionImpl<State, Actions> = (
  data?: any
) =>
  | ((state: State, actions: Actions) => ActionResult<State>)
  | ActionResult<State>

export type ActionsImpl<State, Actions> = {
  [P in keyof Actions]:
    | ActionImpl<State, Actions>
    | ActionsImpl<any, Actions[P]>
}

export interface ModuleImpl<State, Actions> {
  state: State
  actions: ActionsImpl<State, Actions>
}
