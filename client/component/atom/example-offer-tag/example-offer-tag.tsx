/* eslint-disable no-useless-computed-key */

import {faHashtag} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {GeneralIcon, LoadingIcon, Tag, TagIconbag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ExampleOffer, ObjectId} from "/client/skeleton";


export const ExampleOfferTag = create(
  require("./example-offer-tag.scss"), "ExampleOfferTag",
  function ({
    offer,
    ...rest
  }: {
    offer: ExampleOffer | {id: ObjectId},
    className?: string
  }): ReactElement | null {

    const {trans, transNumber, transDate} = useTrans("exampleOfferTag");

    const [innerOffer] = useResponse("fetchExampleOffer", (!isFull(offer)) && {id: offer.id});
    const actualOffer = (!isFull(offer)) ? innerOffer : offer;

    return (
      <span styleName="root" {...rest}>
        {(actualOffer !== undefined) ? (
          <>
            <Tag variant="solid">
              {trans(`catalog.${actualOffer.catalog}`)}
            </Tag>
            <Tag variant="light">
              {(actualOffer.catalog === "zpdicDaily") ? (
                transDate(dayjs(actualOffer.createdDate).tz("Asia/Tokyo"), "date")
              ) : (
                <>
                  <TagIconbag><GeneralIcon icon={faHashtag}/></TagIconbag>
                  {transNumber(actualOffer.number)}
                </>
              )}
            </Tag>
          </>
        ) : (
          <Tag variant="solid">
            <LoadingIcon/>
          </Tag>
        )}
      </span>
    );

  }
);


function isFull(offer: ExampleOffer | {id: ObjectId}): offer is ExampleOffer {
  return "catalog" in offer;
}