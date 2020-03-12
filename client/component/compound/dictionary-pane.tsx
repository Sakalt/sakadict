//

import {
  inject
} from "mobx-react";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button
} from "/client/component/atom";
import {
  StoreComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";


@inject("store")
@applyStyle(require("./dictionary-pane.scss"))
class DictionaryPaneBase extends StoreComponentBase<Props, State> {

  private click(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    let path = "/dictionary/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dictionary/setting/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let status = this.props.dictionary.status;
    let href = "/dictionary/" + this.props.dictionary.number;
    let statusString = "";
    if (status === "saving") {
      statusString = "処理中";
    } else if (status === "error") {
      statusString = "エラー";
    } else {
      let wordSize = this.props.dictionary.wordSize;
      if (wordSize !== undefined) {
        statusString = wordSize.toLocaleString("en-GB") + " 語";
      } else {
        statusString = "? 語";
      }
    }
    let settingButtonNode;
    if (this.props.showsSetting) {
      settingButtonNode = <Button label="&#xF013;" color="simple" icon="awesome" onClick={this.jumpSettingPage.bind(this)}/>;
    }
    let node = (
      <a styleName="root" href={href} onClick={this.click.bind(this)}>
        <div styleName="name">
          {settingButtonNode}
          {name}
        </div>
        <div styleName="status">{statusString}</div>
      </a>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton,
  showsSetting: boolean
};
type State = {
};

export let DictionaryPane = withRouter(DictionaryPaneBase);