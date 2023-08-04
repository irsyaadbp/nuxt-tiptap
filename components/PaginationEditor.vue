<template>
  <div class="page--placeholder">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Heading, { Level } from "@tiptap/extension-heading";
import TextAlignment from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Node } from "@tiptap/core";
import { PAGE_BREAK_FORMAT, PAPER_HEIGHT, SPARATOR_HEIGHT } from "~/constants";

const PageBreak = Node.create({
  name: "pageBreak",
  addOptions() {
    return {
      HTMLAttributes: {
        class: "page-break",
      },
    };
  },
  group: "block",
  content: "",
  draggable: false,
  addAttributes() {
    return {
      class: {
        default: "page-break",
      },
    };
  },
  parseHTML() {
    return [{ tag: "div.page-break" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)];
  },
});

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  uploadImageFn: {
    type: Function,
    default: undefined,
  },
});
const emits = defineEmits(["update:modelValue"]);

const textAlign = ref("left");
const textLevelSelected = ref<number | "paragraph">("paragraph");

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
    PageBreak,
  ],
  onUpdate(props) {
    // HTML
    // vModel.value = value.editor.getHTML();

    // let newValue = value.editor.getHTML();

    vModel.value = props.editor.getHTML();
    // console.log(props.editor.getHTML(), "update");
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

watch(
  vModel,
  (newValue, oldValue) => {
    if (shouldAddPageBreak(newValue as string, oldValue as string)) {
      newValue = oldValue + PAGE_BREAK_FORMAT;

      editor.value?.commands.setContent(newValue || "", true);

      nextTick(() => {
        editor.value?.chain().focus("end");
      });
    }
  },
  { deep: true }
);

const shouldAddPageBreak = (currentValue: string, oldValue: string) => {
  // Logika Anda untuk menentukan kapan harus menambahkan elemen page break
  // Misalnya, jika tinggi konten melebihi batas tertentu, Anda bisa menambahkan halaman baru.
  const editorContainer = document.querySelector(".page--placeholder");

  if (editorContainer) {
    // const
    const currentPageCount = currentValue.split(PAGE_BREAK_FORMAT).length;

    const maxEditorHeight =
      PAPER_HEIGHT + (currentPageCount - 1) * (PAPER_HEIGHT + SPARATOR_HEIGHT); // Batas tinggi konten editor

    const hasRoomForNextPage = editorContainer.clientHeight > maxEditorHeight;

    return hasRoomForNextPage;
  }
  return false;
};
</script>

<style lang="scss">
.page--placeholder {
  @apply bg-white;
  //   width: 794px;
  //   height: 1123px;
}

.page-break {
  @apply bg-slate-200;
  page-break-after: always;
  height: 24px;
}
</style>
