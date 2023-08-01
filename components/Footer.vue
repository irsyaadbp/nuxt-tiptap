<template>
  <div class="relative flex-none">
    <div id="show_footer" class="editor_information">
      <div>Footer</div>
    </div>

    <div class="editor_footer" @click="handleFocus">
      <div>
        <editor-content :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Heading, { Level } from "@tiptap/extension-heading";
import TextAlignment from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import BubbleMenu from "@tiptap/extension-bubble-menu";

import ImageResizeable from "~/tiptap-plugins/image/ImageResizeable";
const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  uploadImageFn: {
    type: Function,
    default: undefined,
  },
  editorIndex: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits([
  "update:modelValue",
  "setActive",
  "delete:editor",
  "focus:editor",
]);

const vModel = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
const defaultHeadingClass = "font-bold";
const headingClass: Record<Level, string> = {
  1: "text-7xl",
  2: "text-6xl",
  3: "text-5xl",
  4: "text-4xl",
  5: "text-2xl",
  6: "text-xl",
};

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false,
      bulletList: {
        HTMLAttributes: {
          class: "list-disc",
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal",
        },
      },
    }),
    Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }).extend({
      renderHTML({ node, HTMLAttributes }) {
        return [
          `h${node.attrs.level}`,
          {
            ...HTMLAttributes,
            class: `${defaultHeadingClass} ${
              headingClass[node.attrs.level as Level]
            }`,
          },
          0,
        ];
      },
    }),
    TextAlignment.configure({
      types: ["heading", "paragraph", "nodeSquare"],
    }),
    Underline,
    Subscript,
    Superscript,
    Highlight,
    ImageResizeable.configure({
      inline: true,
      allowBase64: true
    }),
  ],
  onFocus({ editor }) {
    emits("focus:editor", editor);
    setFocusEditor();
  },
  onBlur() {
    setBlurEditor();
  },
  onUpdate: ({ editor }) => {
    // HTML
    vModel.value = editor.getHTML();
  },

  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-h-[300px]",
    },
  },
});

defineExpose({
  editor,
});

// If you use persona use this
// const defaultHeadingClass = "heading--normalcase heading--normal";
// const headingClass = {
//   1: "h1",
//   2: "h2",
//   3: "h3",
//   4: "h4",
//   5: "h5",
//   6: "h6",
// };

function setFocusEditor() {
  const body = document.getElementById("show_footer");
  body!.classList.add("editor_information--show");
  emits("setActive", props.editorIndex);
  return true;
}
function setBlurEditor() {
  const body = document.getElementById("show_footer");
  body!.classList.remove("editor_information--show");
}
function handleFocus() {
  editor.value?.chain().focus("end");
}

watch(vModel, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue;

  if (isSame) {
    return;
  }

  editor.value?.commands.setContent(newValue || "", false);
});
</script>

<style lang="scss" scoped>
.editor {
  &_footer {
    outline: none;
    border-bottom: none;
    min-height: 97px;

    padding-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 15px;
  }
  &_information {
    display: none;
  }
  &_information--show {
    @apply border-t-2 border-b-2 border-gray-500;
    position: absolute;
    z-index: 2;
    width: 100%;
    display: block;
    background-color: #f8f9fa;
    padding: 10px;
    font-weight: 500;
    top: -48px;
  }
}
</style>
tiptap-plugins/image/ImageResizeable