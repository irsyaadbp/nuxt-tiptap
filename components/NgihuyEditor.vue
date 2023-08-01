<template>
  <div
    ref="content"
    class="editor flex-1"
    @click="handleFocus"
    style="max-width: 100%; max-height: 100%"
  >
    <div class="editor__content">
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
import BubbleMenu from "@tiptap/extension-bubble-menu";

import NodeShape from "~/tiptap-plugins/NodeShape";
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

const inputImage = ref<HTMLInputElement>();

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
      allowBase64: true,
    }),

    BubbleMenu,
  ],
  onFocus({ editor }) {
    emits("focus:editor", editor);
    setFocusEditor();
  },
  onTransaction(props) {},
  onUpdate: ({ editor }) => {
    if (editor.isEmpty && props.editorIndex > 0) {
      emits("delete:editor", props.editorIndex);
    }
    // HTML
    vModel.value = editor.getHTML();
  },

  // onSelectionUpdate(event) {
  //   if (event.editor?.isActive("heading")) {
  //     [1, 2, 3, 4, 5, 6].forEach((level) => {
  //       if (event.editor.isActive("heading", { level })) {
  //         textLevelSelected.value = level;
  //       }
  //     });
  //   } else {
  //     textLevelSelected.value = "paragraph";
  //   }

  //   textAlignment.forEach((align) => {
  //     if (event.editor.isActive({ textAlign: align.value })) {
  //       textAlign.value = align.value;
  //     }
  //   });
  // },
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none max-h-[929px]",
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
  emits("setActive", props.editorIndex);
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
  padding-left: 20px;
  padding-right: 20px;
  // width: 816px;

  border-top: none;
  // margin: 2px;

  &__content {
    @apply border-4 border-gray-800 rounded-b-lg;
    border: 0;
    border-radius: 0;
  }

  &__header {
    @apply bg-gray-800 rounded-t-lg px-3 py-2 flex gap-1 items-center;

    &.is-hidden {
      visibility: hidden;
      opacity: 0;
    }

    &.is-focused {
      visibility: visible;
      opacity: 1;
      transition: visibility 0.2s, opacity 0.2s;
    }

    &-btn {
      @apply text-white;
      vertical-align: middle;

      font-weight: bold;
      display: inline-flex;
      background: transparent;
      border: 0;

      padding: 6px;

      border-radius: 3px;
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        @apply bg-gray-700;
      }

      &.is-active {
        @apply bg-gray-700;
      }
    }
  }
}
</style>
tiptap-plugins/image/ImageResizeable
