/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, useCallback, useState} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {ExampleList} from "/client-new/component/compound/example-list";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchExampleForm} from "/client-new/component/compound/search-example-form";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";
import {useSuspenseResponse} from "/client-new/hook/request";
import {calcOffsetSpec} from "/client-new/util/misc";


export const ExamplePage = create(
  require("./example-page.scss"), "ExamplePage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("examplePage");

    const dictionary = useDictionary();

    const [page, setPage] = useState(0);
    const [[hitExamples, hitSize]] = useSuspenseResponse("fetchExamples", {number: dictionary.number, ...calcOffsetSpec(page, 40)}, {keepPreviousData: true});

    const handlePageSet = useCallback(function (page: number): void {
      setPage(page);
      window.scrollTo(0, 0);
    }, []);

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} width="wide" tabValue="example"/>
        </Fragment>
      )}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <div styleName="sticky">
              <SearchExampleForm styleName="form"/>
            </div>
          </div>
          <div styleName="right">
            <ExampleList dictionary={dictionary} examples={hitExamples} pageSpec={{size: 40, hitSize, page, onPageSet: handlePageSet}}/>
          </div>
        </MainContainer>
      </Page>
    );

  }
);