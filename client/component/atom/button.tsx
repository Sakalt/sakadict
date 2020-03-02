//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    type: "button",
    color: null
  };

  public render(): ReactNode {
    let styleName = "button";
    if (this.props.color === "simple") {
      styleName = "simple";
    }
    let node = (
      <input styleName={styleName} type="button" value={this.props.label} onClick={this.props.onClick}/>
    );
    return node;
  }

}


type Props = {
  label: string,
  type: "button" | "submit",
  color: "simple" | null,
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
};
type State = {
};