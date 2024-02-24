//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {ResourceCard} from "./resource-card";


export const ResourceList = create(
  require("./resource-list.scss"), "ResourceList",
  function ({
    dictionary,
    resources,
    pageSpec,
    ...rest
  }: {
    dictionary: Dictionary,
    resources: Array<string> | undefined,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("resourceList");

    return (
      <List styleName="root" items={resources} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(resource) => <ResourceCard key={resource} dictionary={dictionary} resource={resource}/>}
          <ListLoadingView styleName="loading"/>
          <ListEmptyView styleName="loading">
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);