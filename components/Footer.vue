<template>
  <div class="relative">
    <div id="show_footer" class="editor_information">
      <div>Footer</div>
    </div>
  </div>
  <div class="editor_header" @click="handleFocus">
    <div>
      <editor-content :editor="editor" />
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
import Image from "@tiptap/extension-image";

import IconTextLeft from "~/components/icon/TextLeft.vue";
import IconTextRight from "~/components/icon/TextRight.vue";
import IconTextCenter from "~/components/icon/TextCenter.vue";
import IconTextJustify from "~/components/icon/TextJustify.vue";

import NodeShape from "~/tiptap-plugins/NodeShape";

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
const emits = defineEmits(["update:modelValue", "setActive", "delete:editor"]);

const textAlign = ref("left");
const textLevelSelected = ref<number | "paragraph">("paragraph");
const inputImage = ref<HTMLInputElement>();

const vModel = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
const textAlignment = [
  {
    text: "Left",
    value: "left",
  },
  {
    text: "Center",
    value: "center",
  },
  {
    text: "Right",
    value: "right",
  },
  {
    text: "Justify",
    value: "justify",
  },
];
const iconAlignment: Record<any, any> = {
  left: IconTextLeft,
  right: IconTextRight,
  center: IconTextCenter,
  justify: IconTextJustify,
};
const textLevel = [
  {
    text: "Paragraph",
    value: "paragraph",
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    text: `Heading ${i + 1}`,
    value: i + 1,
  })),
];
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
    Image.configure({
      inline: true,
    }),
    NodeShape,
  ],
  onFocus() {
    setFocusEditor();
  },
  onBlur() {
    setBlurEditor();
  },
  onTransaction(props) {
    console.log(props.transaction);
  },
  onUpdate: ({ editor }) => {
    if (editor.isEmpty && props.editorIndex > 0) {
      emits("delete:editor", props.editorIndex);
    }
    // HTML
    vModel.value = editor.getHTML();
  },

  onSelectionUpdate(event) {
    if (event.editor?.isActive("heading")) {
      [1, 2, 3, 4, 5, 6].forEach((level) => {
        if (event.editor.isActive("heading", { level })) {
          textLevelSelected.value = level;
        }
      });
    } else {
      textLevelSelected.value = "paragraph";
    }

    textAlignment.forEach((align) => {
      if (event.editor.isActive({ textAlign: align.value })) {
        textAlign.value = align.value;
      }
    });
  },
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
    },
  },
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

function handleChooseHead(newValue: any) {
  if (newValue === "paragraph") {
    return editor.value?.chain().focus().setParagraph().run();
  }
  editor.value
    ?.chain()
    .focus()
    .toggleHeading({ level: Number(newValue) as Level })
    .run();
}

function handleChooseAlignment(newValue: string) {
  editor.value?.chain().focus().setTextAlign(newValue).run();
}
function handleUploadImage() {
  if (inputImage.value) {
    inputImage.value?.click();
  }
}
async function handleChangeImage(event: Event) {
  const allowFiles = ["jpg", "jpeg", "png"];
  const file = (event.target as HTMLInputElement).files?.[0];

  if (confirm("Are you sure to upload this image?")) {
    if (file) {
      if (allowFiles.findIndex((type) => file.type.includes(type)) === -1) {
        return alert(`File type ${file.type} not allowed, only ${allowFiles}`);
      }

      // TODO: change this to api return url image
      const urlImage = props.uploadImageFn
        ? await props.uploadImageFn(file)
        : URL.createObjectURL(file);

      if (urlImage) {
        editor.value?.chain().setImage({ src: urlImage }).run();
      }
    }
  }
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
  &_header {
    outline: none;
    border-bottom: none;
    min-height: 97px;

    padding-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
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
    top: -80px;
  }
}
</style>
