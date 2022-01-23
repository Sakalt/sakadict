//

import * as react from "react";
import {
  Dispatch,
  Fragment,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useMemo,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component-function/atom/button";
import Link from "/client/component-function/atom/link";
import Markdown from "/client/component-function/atom/markdown";
import ExampleEditor from "/client/component-function/compound/example-editor";
import WordEditor from "/client/component-function/compound/word-editor";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import {
  DetailedWord,
  EditableExample,
  EditableWord,
  EnhancedDictionary,
  Example,
  Relation,
  Word
} from "/client/skeleton/dictionary";
import {
  AwsUtil
} from "/client/util/aws";


const WordPane = create(
  require("./word-pane.scss"), "WordPane",
  function ({
    dictionary,
    word,
    style = "normal",
    showEditLink,
    showButton = false,
    onSubmit,
    onEditConfirm,
    onDiscardConfirm,
    onEditExampleConfirm,
    onDiscardExampleConfirm
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    style?: "normal" | "simple",
    showEditLink: boolean,
    showButton?: boolean,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void,
    onEditConfirm?: (word: EditableWord, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onEditExampleConfirm?: (example: EditableExample, event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
    onDiscardExampleConfirm?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [editorOpen, setEditorOpen] = useState(false);
    let [editingExample, setEditingExample] = useState<Example | null>(null);

    let innerProps = {dictionary, word, showEditLink, showButton};
    let nameNode = <WordPaneName {...innerProps} {...{onSubmit, setEditorOpen}}/>;
    let equivalentNode = <WordPaneEquivalents {...innerProps}/>;
    let informationNode = (style === "normal") && <WordPaneInformations {...innerProps}/>;
    let relationNode = (style === "normal") && <WordPaneRelations {...innerProps}/>;
    let exampleNode = (style === "normal") && <WordPaneExamples {...innerProps} {...{setEditingExample}}/>;
    let editorNode = (!showButton && editorOpen) && (
      <WordEditor
        dictionary={dictionary}
        word={word}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onEditConfirm={onEditConfirm}
        onDiscardConfirm={onDiscardConfirm}
      />
    );
    let exampleEditorNode = (!showButton && editingExample !== null) && (
      <ExampleEditor
        dictionary={dictionary}
        example={editingExample}
        open={editingExample !== null}
        onClose={() => setEditingExample(null)}
        onEditConfirm={onEditExampleConfirm}
        onDiscardConfirm={onDiscardExampleConfirm}
      />
    );
    let node = (
      <div styleName="root">
        {nameNode}
        {equivalentNode}
        {informationNode}
        {exampleNode}
        {relationNode}
        {editorNode}
        {exampleEditorNode}
      </div>
    );
    return node;

  }
);


const WordPaneName = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word,
    showEditLink,
    showButton,
    onSubmit,
    setEditorOpen
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    showEditLink: boolean,
    showButton: boolean,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void,
    setEditorOpen: Dispatch<SetStateAction<boolean>>
  }): ReactElement {

    let [, {trans}] = useIntl();

    let pronunciationText = useMemo(() => {
      if (word.pronunciation !== undefined) {
        if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
          return word.pronunciation;
        } else {
          return "/" + word.pronunciation + "/";
        }
      } else {
        let akrantiain = dictionary.getAkrantiain();
        if (akrantiain !== null) {
          try {
            let pronunciation = akrantiain.convert(word.name);
            return "/" + pronunciation + "/";
          } catch (error) {
            console.error(error);
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    }, [dictionary, word]);
    let editButtonNode = (showEditLink && !showButton) && (
      <div styleName="button">
        <Button label={trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => setEditorOpen(true)}/>
      </div>
    );
    let submitButtonNode = (showButton) && (
      <div styleName="button">
        <Button label={trans("wordPane.submit")} iconLabel="&#xF00C;" style="simple" onClick={onSubmit}/>
      </div>
    );
    let pronunciationNode = (pronunciationText !== undefined) && (() => {
      let pronunciationNode = <div styleName="pronunciation">{pronunciationText}</div>;
      return pronunciationNode;
    })();
    let tagNode = (word.tags.length > 0) && (() => {
      let tagBoxNodes = word.tags.map((tag, index) => {
        let tagBoxNode = (tag !== "") && <span styleName="box" key={index}>{tag}</span>;
        return tagBoxNode;
      });
      let tagNode = <div styleName="tag">{tagBoxNodes}</div>;
      return tagNode;
    })();
    let node = (
      <div styleName="name-wrapper">
        <div styleName="left">
          <div styleName="name">{word.name}</div>
          {pronunciationNode}
          {tagNode}
        </div>
        <div styleName="right">
          {editButtonNode}
          {submitButtonNode}
        </div>
      </div>
    );
    return node;

  }
);


const WordPaneEquivalents = create(
  require("./word-pane.scss"),
  function ({
    word
  }: {
    word: Word | DetailedWord
  }): ReactElement | null {

    let innerNodes = word.equivalents.map((equivalent, index) => {
      let titleNode = (equivalent.title !== "") && <span styleName="box">{equivalent.title}</span>;
      let innerNode = (
        <span styleName="equivalent" key={index}>
          {titleNode}
          {equivalent.names.join(", ")}
          <br/>
        </span>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node || null;

  }
);


const WordPaneInformations = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord
  }): ReactElement {

    let innerNodes = word.informations.map((information, index) => {
      let homePath = AwsUtil.getFileUrl(`resource/${dictionary.number}/`);
      let textNode = (dictionary.settings.enableMarkdown) ? <Markdown source={information.text} homePath={homePath}/> : <p styleName="text">{information.text}</p>;
      let informationNode = (
        <div styleName="container" key={index}>
          <div styleName="title">{information.title}</div>
          {textNode}
        </div>
      );
      return informationNode;
    });
    let node = (
      <Fragment>
        {innerNodes}
      </Fragment>
    );
    return node;

  }
);


const WordPaneRelations = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord
  }): ReactElement | null {

    let groupedRelations = new Map<string, Array<Relation>>();
    for (let relation of word.relations) {
      let title = relation.title;
      if (groupedRelations.get(title) === undefined) {
        groupedRelations.set(title, []);
      }
      groupedRelations.get(title)!.push(relation);
    }
    let innerNodes = Array.from(groupedRelations).map(([title, relations], index) => {
      let titleNode = (title !== "") && <span styleName="box">{title}</span>;
      let relationNodes = relations.map((relation, relationIndex) => {
        let href = "/dictionary/" + dictionary.number + "?search=" + encodeURIComponent(relation.name) + "&mode=name&type=exact&page=0";
        let relationNode = (
          <Fragment key={relationIndex}>
            {(relationIndex === 0) ? "" : ", "}
            <Link href={href} target="self">{relation.name}</Link>
          </Fragment>
        );
        return relationNode;
      });
      let innerNode = (
        <span styleName="relations" key={index}>
          <span styleName="confer"/>
          {titleNode}
          {relationNodes}
          <br/>
        </span>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <p styleName="text">
          {innerNodes}
        </p>
      </div>
    );
    return node || null;

  }
);


const WordPaneExamples = create(
  require("./word-pane.scss"),
  function ({
    dictionary,
    word,
    showEditLink,
    showButton,
    setEditingExample
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    showEditLink: boolean,
    showButton: boolean,
    setEditingExample: Dispatch<SetStateAction<Example | null>>
  }): ReactElement | null {

    let [, {trans}] = useIntl();

    let examples = ("examples" in word) ? word.examples : [];
    let innerNodes = examples.map((example, index) => {
      let editButtonNode = (showEditLink && !showButton) && (
        <div styleName="button">
          <Button label={trans("wordPane.edit")} iconLabel="&#xF044;" style="simple" hideLabel={true} onClick={() => setEditingExample(example)}/>
        </div>
      );
      let innerNode = (
        <li key={index}>
          <div styleName="example-content-wrapper">
            <div styleName="example-content">
              <span styleName="sentence">{example.sentence}</span>
              <span styleName="translation">{example.translation}</span>
            </div>
            {editButtonNode}
          </div>
        </li>
      );
      return innerNode;
    });
    let node = (innerNodes.length > 0) && (
      <div styleName="container">
        <div styleName="title">{dictionary.settings.exampleTitle}</div>
        <ul styleName="example">
          {innerNodes}
        </ul>
      </div>
    );
    return node || null;

  }
);


export default WordPane;