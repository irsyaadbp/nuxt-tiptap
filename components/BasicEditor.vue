<template>
  <div class="editor">
    <div class="editor__header">
      <template v-if="editor">
        <dropdown
          v-model="textLevelSelected"
          :items="textLevel"
          @update:model-value="handleChooseHead"
        />

        <dropdown
          v-model="textAlign"
          :items="textAlignment"
          orientation="horizontal"
          @update:model-value="handleChooseAlignment"
        >
          <template #selected="{ value }">
            <component :is="iconAlignment[value]" />
          </template>
          <template #item="{ item }">
            <component :is="iconAlignment[item.value]" />
          </template>
        </dropdown>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <icon-bold />
        </button>
        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <icon-italic />
        </button>
        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('subscript') }"
          @click="editor.chain().focus().toggleSubscript().run()"
        >
          <icon-subscript />
        </button>
        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('superscript') }"
          @click="editor.chain().focus().toggleSuperscript().run()"
        >
          <icon-superscript />
        </button>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <icon-strike />
        </button>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <icon-underline />
        </button>
        <button
          class="editor__header-btn"
          :class="{
            'is-active': editor.isActive('highlight'),
          }"
          @click="editor.chain().focus().toggleHighlight().run()"
        >
          <icon-highlight />
        </button>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <icon-bullet-list />
        </button>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <icon-number-list />
        </button>

        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <icon-blockquote />
        </button>
        <button
          class="editor__header-btn"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="handleUploadImage"
        >
          <icon-image />
        </button>
        <input
          ref="inputImage"
          type="file"
          accept=".jpg,.jpeg,.png"
          class="hidden"
          @change="handleChangeImage"
        />

        <button
          class="editor__header-btn"
          @click="editor.chain().focus().undo().run()"
        >
          <icon-undo />
        </button>

        <button
          class="editor__header-btn"
          @click="editor.chain().focus().redo().run()"
        >
          <icon-redo />
        </button>
      </template>
    </div>

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
});
const emits = defineEmits(["update:modelValue"]);

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
      types: ["heading", "paragraph"],
    }),
    Underline,
    Subscript,
    Superscript,
    Highlight,
    Image.configure({
      inline: true,
    }),
    NodeShape
  ],
  onUpdate: (value) => {
    // HTML
    vModel.value = value.editor.getHTML();
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
      style: "min-height: 400px",
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

<style lang="scss">
.editor {
  &__content {
    @apply border-4 border-gray-800 rounded-b-lg p-2;
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
