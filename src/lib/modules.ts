export interface Module<State = any, Actions = any> {
  state: State
  actions: Actions
}

export interface Modules {
  [name: string]: Module
}

export function combineModules(tree: Module & Modules): Modules {
  const modules = {}

  for (let name in tree.modules || {}) {
    modules[name] = combineModules(tree.modules[name])
  }

  const state = tree.state || {}
  const actions = tree.actions || {}

  for (let name in modules) {
    state[name] = modules[name].state || {}
    actions[name] = modules[name].actions || {}
  }

  return { state, actions }
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
