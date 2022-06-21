//

import * as react from "react";
import {
  useState
} from "react";
import {
  TextArea
} from "/client/component/atom/text-area";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/TextArea",
  component: TextArea,
  argTypes: {
    value: {control: {disable: true}}
  }
};

const template = createTemplate<typeof TextArea>((props) => {
  const [value, setValue] = useState(props.value);
  const node = (
    <div style={{height: "200px", display: "flex"}}>
      <TextArea {...props} value={value} onSet={(value) => (props.onSet?.(value), setValue(value))}/>
    </div>
  );
  return node;
});

export const Normal = createStory(template);
Normal.args = {
  value: "TextArea\ntextarea textarea"
};

export const Labeled = createStory(template);
Labeled.args = {
  value: "TextArea\ntextarea textarea",
  label: "Label"
};

export const Monospace = createStory(template);
Monospace.args = {
  value: "TextArea\ntextarea textarea",
  font: "monospace"
};

export const Highlight = createStory(template);
Highlight.args = {
  value: "cons = \"s\" 3 | \"t\" 3 | \"k\" 2 | \"p\" 1;\nvowel = \"a\" 3 | \"e\" 2;\n% cons vowel cons (cons | \"\") - cons &1",
  font: "monospace",
  language: "zatlin"
};