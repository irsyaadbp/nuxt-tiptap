<template>
  <!-- <div v-html="test"></div> -->
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
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import { Node } from "@tiptap/core";
import {
  PAGE_BREAK_FORMAT,
  PAGE_BREAK_FORMAT_CHECK,
  PAPER_HEIGHT,
  SPARATOR_HEIGHT,
} from "~/constants";

const test = ref("");

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

function getValueStyle(element: any, name: string) {
  const style: string[] = element.getAttribute("style").split(";");
  const findName = style.find((item) => item.includes(name));

  return findName?.split(":")[1] || "";
}

const customAttribute: Record<any, any> = {
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this?.parent?.(),

      borderBottom: {
        default: "",
        parseHTML: (element) => {
          return (
            element.style.borderBottom ||
            getValueStyle(element, "border-bottom")
          );
        },
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.borderBottom))
            return {};
          return {
            style: `border-bottom: ${attributes.borderBottom}`,
          };
        },
      },
      borderLeft: {
        default: "",
        parseHTML: (element) =>
          element.style.borderLeft || getValueStyle(element, "border-left"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.borderLeft)) return {};
          return {
            style: `border-left: ${attributes.borderLeft}`,
          };
        },
      },
      borderRight: {
        default: "",
        parseHTML: (element) =>
          element.style.borderRight || getValueStyle(element, "border-right"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.borderRight)) return {};
          return {
            style: `border-right: ${attributes.borderRight}`,
          };
        },
      },
      borderTop: {
        default: "",
        parseHTML: (element) =>
          element.style.borderTop || getValueStyle(element, "border-top"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.borderTop)) return {};
          return {
            style: `border-top: ${attributes.borderTop}`,
          };
        },
      },
      border: {
        default: "",
        parseHTML: (element) =>
          element.style.border || getValueStyle(element, "border-border"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.border)) return {};
          return {
            style: `border: ${attributes.border}`,
          };
        },
      },
      verticalAlign: {
        default: "",
        parseHTML: (element) =>
          element.style.verticalAlign ||
          getValueStyle(element, "vertical-align"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.verticalAlign))
            return {};
          return {
            style: `vertical-align: ${attributes.verticalAlign}`,
          };
        },
      },
      padding: {
        default: "",
        parseHTML: (element) =>
          element.style.padding || getValueStyle(element, "padding"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.padding)) return {};
          return {
            style: `padding: ${attributes.padding}`,
          };
        },
      },
      paddingTop: {
        default: "",
        parseHTML: (element) =>
          element.style.paddingTop || getValueStyle(element, "padding-top"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.paddingTop)) return {};
          return {
            style: `padding-top: ${attributes.paddingTop}`,
          };
        },
      },
      paddingLeft: {
        default: "",
        parseHTML: (element) =>
          element.style.paddingLeft || getValueStyle(element, "padding-left"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.paddingLeft)) return {};
          return {
            style: `padding-left: ${attributes.paddingLeft}`,
          };
        },
      },
      paddingBottom: {
        default: "",
        parseHTML: (element) =>
          element.style.paddingBottom ||
          getValueStyle(element, "padding-bottom"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.paddingBottom))
            return {};
          return {
            style: `padding-bottom: ${attributes.paddingBottom}`,
          };
        },
      },
      overflow: {
        default: "",
        parseHTML: (element) =>
          element.style.overflow || getValueStyle(element, "overflow"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.overflow)) return {};
          return {
            style: `overflow: ${attributes.overflow}`,
          };
        },
      },
      overflowWrap: {
        default: "",
        parseHTML: (element) =>
          element.style.overflowWrap || getValueStyle(element, "overflow-wrap"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.overflowWrap))
            return {};
          return {
            style: `overflow-wrap: ${attributes.overflowWrap}`,
          };
        },
      },
      height: {
        default: "",
        parseHTML: (element) =>
          element.style.height || getValueStyle(element, "height"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.height)) return {};
          return {
            style: `height: ${attributes.height}`,
          };
        },
      },
      borderCollapse: {
        default: "",
        parseHTML: (element) =>
          element.style.borderCollapse ||
          getValueStyle(element, "border-collapse"),
        renderHTML: (attributes) => {
          if ([undefined, null, ""].includes(attributes.borderCollapse))
            return {};
          return {
            style: `border-collapse: ${attributes.borderCollapse}`,
          };
        },
      },
    };
  },
};

const CustomTable = Table.extend(customAttribute);
const CustomTableCell = TableCell.extend(customAttribute);
const CustomTableRow = TableRow.extend(customAttribute);
const CustomTableHeader = TableHeader.extend(customAttribute);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
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
  1: "text-3xl",
  2: "text-2xl",
  3: "text-xl",
  4: "text-xl",
  5: "text-xl",
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
    CustomTable.configure({
      resizable: false,
    }),
    CustomTableRow,
    CustomTableHeader,
    // TableCell,
    CustomTableCell,
  ],
  onUpdate(props) {
    // HTML
    console.log("update");
    vModel.value = props.editor.getHTML();
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
      style: "any",
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

// watch(
//   vModel,
//   (newValue, oldValue) => {
//     const editorContainer = document.querySelector(
//       ".page--placeholder"
//     ) as HTMLDivElement;

//     if (editorContainer) {
//       // const
//       const separatePage = (newValue as string).split(PAGE_BREAK_FORMAT_CHECK);
//       const currentPageCount = separatePage.length;

//       if (shouldAddPageBreak(currentPageCount, editorContainer)) {
//         newValue = (newValue || "").replace(/<p><\/p>(?![\s\S]*<p><\/p>)/, "");
//         newValue += PAGE_BREAK_FORMAT;

//         editor.value?.commands.setContent(newValue || "", true);
//         return;
//       }

//       if (
//         shouldDeletePageBreak(
//           separatePage[currentPageCount - 1],
//           currentPageCount
//         )
//       ) {
//         const indexEmpty = separatePage.findIndex((item) => item === "");

//         if (indexEmpty < 1) return;

//         const _newValue = separatePage
//           .filter((_item, idx) => idx !== indexEmpty)
//           .join(PAGE_BREAK_FORMAT_CHECK);

//         if (
//           newValue?.includes(PAGE_BREAK_FORMAT) &&
//           separatePage[currentPageCount - 1] !== ""
//         )
//           return;

//         editor.value?.commands.setContent(_newValue || "", true);
//         nextTick(() => {
//           editor.value?.chain().focus("end");
//         });
//       }
//     }
//   },
//   { deep: true }
// );

const shouldAddPageBreak = (
  currentPageCount: number,
  editorContainer: HTMLDivElement
) => {
  // Logika Anda untuk menentukan kapan harus menambahkan elemen page break
  // Misalnya, jika tinggi konten melebihi batas tertentu, Anda bisa menambahkan halaman baru.

  const maxEditorHeight =
    PAPER_HEIGHT + (currentPageCount - 1) * (PAPER_HEIGHT + SPARATOR_HEIGHT); // Batas tinggi konten editor

  const hasRoomForNextPage = editorContainer.clientHeight > maxEditorHeight;

  return hasRoomForNextPage;
};

function shouldDeletePageBreak(content: string, page: number) {
  return page > 1 && content === "";
}

function handlePaste(event: any) {
  const clipboardData = event.clipboardData;
  const pastedText = clipboardData.getData("text/html");
  // const pastedText = clipboardData.getData("text/plain");
  console.log("pastedText", pastedText);

  // Process the pasted text or apply custom logic
  // const transformedText = transformPastedText(pastedText);
  const transformedText = pastedText;
  test.value = pastedText;
  // editor.value?.commands.setContent(transformedText, true);

  // editor.value?.commands.insertContent(transformedText);
  editor.value?.chain().focus().insertContent(transformedText).run();
}

// function transformPastedText(text: string) {
//   // Apply your custom transformations to the pasted text
//   return text.toUpperCase(); // Example: converting text to uppercase
// }
</script>

<style lang="scss">
.page--placeholder {
  @apply bg-white;
  // @apply px-6 py-8;
  //   width: 794px;
  //   height: 1123px;
}

.page-break {
  @apply bg-slate-200;
  page-break-after: always;
  height: 24px;
}
</style>
