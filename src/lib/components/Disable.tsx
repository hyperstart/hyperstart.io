export interface DisableProps {
  disabled: boolean
}

export const Disable = ({ disabled }: DisableProps, children) => {
  if (disabled) {
    children.forEach(child => {
      if (child.props) {
        child.props.disabled = true
      }
    })
  }
  return children
}
