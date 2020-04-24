//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";
import {
  validatePassword
} from "/server/model/validation";


@route @inject
@applyStyle(require("./change-user-password-form.scss"))
export class ChangeUserPasswordForm extends StoreComponent<Props, State> {

  public state: State = {
    password: ""
  };

  private async handleClick(event: MouseEvent<HTMLElement>): Promise<void> {
    let password = this.state.password;
    let response = await this.requestPost("changeUserPassword", {password});
    if (response.status === 200) {
      this.props.store!.sendInformation("passwordChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let validatePasswordString = function (password: string): string | null {
      return (validatePassword(password)) ? null : getMessage("invalidPassword");
    };
    let node = (
      <form styleName="root">
        <Input label="パスワード" type="flexible" value={this.state.password} validate={validatePasswordString} usesTooltip={true} onSet={(password) => this.setState({password})}/>
        <Button label="変更" reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  onSubmit?: () => void
};
type State = {
  password: string
};