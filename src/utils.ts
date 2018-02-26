export const combineModules = tree => {
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

  const view = (state, actions) => {
    const subviews = {}
    for (let name in modules) {
      if (!modules[name].view) continue
      subviews[name] = modules[name].view(state[name], actions[name])
    }
    return tree.view && tree.view(state, actions, subviews)
  }

  return { state, actions, view }
}
