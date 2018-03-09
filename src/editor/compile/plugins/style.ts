import { State } from "../../api"
import { CompileOutput } from "../api"
import { CompilationResult } from "./api"

const wrapper = (id, css) => `
function createStyleNode(id, content) {
  var styleNode =
    document.getElementById(id) || document.createElement('style');

  styleNode.setAttribute('id', id);
  styleNode.type = 'text/css';
  if (styleNode.styleSheet) {
    styleNode.styleSheet.cssText = content;
  } else {
    styleNode.innerHTML = '';
    styleNode.appendChild(document.createTextNode(content));
  }
  document.head.appendChild(styleNode);
}

createStyleNode(
  ${JSON.stringify(id)},
  ${JSON.stringify(css)}
);
`

export const style = (state: State, result: CompileOutput): any => {
  return {
    name: "hyperstart-style",
    transform(code: string, id: string): CompilationResult | null {
      if (!id.endsWith(".css")) {
        return null
      }

      return {
        code: wrapper("css-for-" + id, code),
        map: { mappings: "" }
      }
    }
  }
}
