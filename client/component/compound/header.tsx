//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import HeaderMenuItem from "/client/component/compound/header-menu-item";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  useUser
} from "/client/component/hook";


const Header = create(
  require("./header.scss"), "Header",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [user] = useUser();

    let userNameNode = (user !== null) && (
      <HeaderMenuItem label={user.screenName} href="/dashboard"/>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link href="/" target="self" style="plane">ZpDIC</Link>
            </div>
            <div styleName="menu">
              <HeaderMenuItem label={trans("header.dictionaryList")} iconName="book" href="/list"/>
              <HeaderMenuItem label={trans("header.notification")} iconName="info-circle" href="/notification"/>
              <HeaderMenuItem label={trans("header.document")} iconName="book-open" href="/document"/>
              <HeaderMenuItem label={trans("header.contact")} iconName="envelope" href="/contact"/>
              <HeaderMenuItem label={trans("header.language")} iconName="language" href="/language"/>
            </div>
          </div>
          <div styleName="right">
            {userNameNode}
          </div>
        </div>
      </header>
    );
    return node;

  }
);


export default Header;