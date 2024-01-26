/* eslint-disable react/jsx-closing-bracket-location */

import {faGripVertical, faMinus, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {nanoid} from "nanoid";
import {ReactElement, useCallback} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  TagInput,
  useTrans
} from "zographia";
import {RelationWordSelect} from "/client-new/component/atom/relation-word-select";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormSpec} from "./edit-word-form-hook";


export const EditWordFormRelationSection = create(
  require("./edit-word-form-equivalent-section.scss"), "EditWordFormRelationSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditWordFormSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {register, control} = form;
    const relationsSpec = useFieldArray({control, name: "relations"});

    const addRelation = useCallback(function (): void {
      relationsSpec.append({
        tempId: nanoid(),
        titles: [],
        word: null
      });
    }, [relationsSpec]);

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.relations")}</h3>
        <div styleName="item-list">
          {relationsSpec.fields.map((relation, index) => (
            <div styleName="item" key={relation.tempId}>
              <div styleName="grip">
                <GeneralIcon icon={faGripVertical}/>
              </div>
              <fieldset styleName="field-list">
                <ControlContainer>
                  <ControlLabel>{trans("label.relation.titles")}</ControlLabel>
                  <Controller name={`relations.${index}.titles`} control={form.control} render={({field}) => (
                    <TagInput values={field.value} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.relation.name")}</ControlLabel>
                  <Controller name={`relations.${index}.word`} control={form.control} render={({field}) => (
                    <RelationWordSelect dictionary={dictionary} word={field.value} onSet={field.onChange}/>
                  )}/>
                </ControlContainer>
              </fieldset>
              <div styleName="minus">
                <Button scheme="gray" variant="light" onClick={() => relationsSpec.remove(index)}>
                  <GeneralIcon icon={faMinus}/>
                </Button>
              </div>
            </div>
          ))}
          <div styleName="plus">
            <Button scheme="gray" variant="light" onClick={addRelation}>
              <GeneralIcon icon={faPlus}/>
            </Button>
          </div>
        </div>
      </section>
    );

  }
);