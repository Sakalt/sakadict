/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement} from "react";
import {Outlet, useMatch} from "react-router";
import {AdditionalProps} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";


export const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const match = useMatch("/dictionary/:dictionaryNumber/:tabPath/:subTabPath?");
    const tabValue = getTabValue(match?.params.tabPath);
    const width = (tabValue === "dictionary" || tabValue === "example") ? "wide" : "normal";
    const insertTopPadding = tabValue !== "setting";

    const dictionary = useDictionary();

    return (
      <Page {...rest} insertPadding={{top: insertTopPadding, bottom: true, horizontal: true}} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} width={width} tabValue={tabValue}/>
        </Fragment>
      )}>
        <MainContainer styleName="main" width={width}>
          <Outlet/>
        </MainContainer>
      </Page>
    );

  }
);


function getTabValue(tabPath: string | undefined): "dictionary" | "example" | "information" | "commission" | "setting" | null {
  if (tabPath === undefined) {
    return "dictionary";
  } else if (tabPath === "sentences") {
    return "example";
  } else if (tabPath === "info") {
    return "information";
  } else if (tabPath === "requests") {
    return "commission";
  } else if (tabPath === "settings") {
    return "setting";
  } else {
    return null;
  }
}