<template>
  <div class="bg-slate-100 pb-6">
    <div v-if="editor" class="editor__toolbar">
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
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <icon-bold />
      </button>
      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <icon-italic />
      </button>
      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('subscript') }"
        @click="editor.chain().focus().toggleSubscript().run()"
      >
        <icon-subscript />
      </button>
      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('superscript') }"
        @click="editor.chain().focus().toggleSuperscript().run()"
      >
        <icon-superscript />
      </button>

      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <icon-strike />
      </button>

      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <icon-underline />
      </button>
      <button
        class="editor__toolbar-btn"
        :class="{
          'is-active': editor.isActive('highlight'),
        }"
        @click="editor.chain().focus().toggleHighlight().run()"
      >
        <icon-highlight />
      </button>

      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <icon-bullet-list />
      </button>

      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <icon-number-list />
      </button>

      <button
        class="editor__toolbar-btn"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <icon-blockquote />
      </button>
      <button
        class="editor__toolbar-btn"
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
        class="editor__toolbar-btn"
        @click="editor.chain().focus().undo().run()"
      >
        <icon-undo />
      </button>

      <button
        class="editor__toolbar-btn"
        @click="editor.chain().focus().redo().run()"
      >
        <icon-redo />
      </button>

      <bubble-menu
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        class="position-handle"
        :should-show="({ editor }) => editor.isActive('ImageResizeable')"
        v-if="editor"
      >
        <div class="flex gap-1">
          <button
            type="button"
            @click="editor.chain().focus().setDisplayImage('float-left').run()"
            :class="{
              'bg-slate-200': editor.isActive('ImageResizeable', {
                display: 'float-left',
              }),
            }"
          >
            <small>Float Left</small>
          </button>
          <button
            type="button"
            @click="editor.chain().focus().setDisplayImage('block').run()"
            :class="{
              'bg-slate-200': editor.isActive('ImageResizeable', {
                display: 'block',
              }),
            }"
          >
            <small>Block</small>
          </button>
          <button
            type="button"
            @click="editor.chain().focus().setDisplayImage('float-right').run()"
            :class="{
              'bg-slate-200': editor.isActive('ImageResizeable', {
                display: 'float-right',
              }),
            }"
          >
            <small>Float Right</small>
          </button>
        </div>
        <template
          v-if="
            editor.isActive('ImageResizeable', {
              display: 'block',
            })
          "
        >
          <div class="divider divider-horizontal w-[1px] bg-gray-400"></div>
          <div class="flex gap-1">
            <button
              type="button"
              @click="editor.chain().focus().setPositionImage('left').run()"
              :class="{
                'bg-slate-200': editor.isActive('ImageResizeable', {
                  position: 'left',
                }),
              }"
            >
              <small>Left</small>
            </button>
            <button
              type="button"
              :class="{
                'bg-slate-200': editor.isActive('ImageResizeable', {
                  position: 'center',
                }),
              }"
              @click="editor.chain().focus().setPositionImage('center').run()"
            >
              <small>Center</small>
            </button>
            <button
              type="button"
              :class="{
                'bg-slate-200': editor.isActive('ImageResizeable', {
                  position: 'right',
                }),
              }"
              @click="editor.chain().focus().setPositionImage('right').run()"
            >
              <small>Right</small>
            </button>
          </div>
        </template>
      </bubble-menu>
    </div>

    <div v-for="(c, i) in content" class="editor_container">
      <Header
        v-model="contentHeader"
        :upload-image-fn="onUploadImage"
        @focus:editor="handleSetActiveEditor"
      />
      <NgihuyEditor
        ref="contentRef"
        :id="`ngihuy-${i}`"
        v-model="content[i]"
        :upload-image-fn="onUploadImage"
        :editor-index="i"
        @delete:editor="onDeleteIndex"
        @set-active="onSetActive"
        @focus:editor="handleSetActiveEditor"
      />
      <Footer
        v-model="contentFooter"
        :upload-image-fn="onUploadImage"
        @focus:editor="handleSetActiveEditor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor, BubbleMenu } from "@tiptap/vue-3";
import IconTextLeft from "~/components/icon/TextLeft.vue";
import IconTextRight from "~/components/icon/TextRight.vue";
import IconTextCenter from "~/components/icon/TextCenter.vue";
import IconTextJustify from "~/components/icon/TextJustify.vue";
import type { Level } from "@tiptap/extension-heading";
definePageMeta({
  title: "Tiptap Editor",
});

const content = ref([""]);
const contentHeader = ref("");
const contentFooter = ref("");
const paperSize = ref(1123);
const headerSize = ref(97);
const footerSize = ref(97);
const editorActive = ref(0);
const contentRef = ref<{ editor: ShallowRef<Editor | undefined> }[]>();
const textAlign = ref("left");
const textLevelSelected = ref<number | "paragraph">("paragraph");
const inputImage = ref<HTMLInputElement>();
const editorContentActive = computed(
  () => contentRef.value?.[editorActive.value]?.editor as Editor
);

const editor = ref<Editor>();

function handleSetActiveEditor(editorFocus: ShallowRef<Editor | undefined>) {
  editor.value = editorFocus;
}

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

onMounted(() => {
  nextTick(() => {
    contentRef.value?.[0]?.editor?.chain().focus();
  });
});

watch(
  () => editor.value,
  (_newVal, _oldVal, onCleanup) => {
    function onSelectionUpdate(event: any) {
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
    }
    editor.value?.on("selectionUpdate", onSelectionUpdate);

    onCleanup(() => {
      editor.value?.off("selectionUpdate", onSelectionUpdate);
    });
  }
);

watch(content.value, (newValue, oldValue) => {
  const contentWrapperHeight =
    document.getElementById(`ngihuy-${editorActive.value}`)?.clientHeight || 0;
  const contentHeight =
    document
      .getElementById(`ngihuy-${editorActive.value}`)
      ?.getElementsByClassName("ProseMirror")?.[0]?.clientHeight || 0;

  // if contentHeight >= 1032px && editorActive is last of array index && click enter
  // console.log(contentHeight, editorActive.value, contentWrapperHeight);
  if (
    contentHeight >= contentWrapperHeight - 10 &&
    editorActive.value === content.value.length - 1
  ) {
    content.value.push("");
    // set focus to the new editor
    nextTick(() => {
      const nextEditor = document
        .getElementById(`ngihuy-${editorActive.value + 1}`)
        ?.getElementsByClassName("ProseMirror")?.[0];

      nextEditor?.focus();
    });
  }
});

function onDeleteIndex(index: number) {
  nextTick(() => {
    content.value.splice(index, 1);
    nextTick(() => {
      const prevEditor: any = document
        .getElementById(`ngihuy-${editorActive.value - 1}`)
        ?.getElementsByClassName("ProseMirror")?.[0];
      prevEditor?.focus();
    });
  });
}

function onSetActive(value: any) {
  editorActive.value = value;
}

async function onUploadImage(source: File) {
  const formData = new FormData();
  formData.append("image", source);
  const { data } = await useFetch<any>("https://api.imgbb.com/1/upload", {
    params: { key: "c3aeb37edbb069e901d9fdec0b1e84d0" },
    body: formData,
    method: "POST",
    onResponseError() {
      alert("Error upload image, please try again later");
    },
  });

  return data?.value?.data?.url;
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

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || "");
    reader.onerror = reject;
  });

async function handleChangeImage(event: Event) {
  const allowFiles = ["jpg", "jpeg", "png"];
  const file = (event.target as HTMLInputElement).files?.[0];

  if (confirm("Are you sure to upload this image?")) {
    if (file) {
      if (allowFiles.findIndex((type) => file.type.includes(type)) === -1) {
        return alert(`File type ${file.type} not allowed, only ${allowFiles}`);
      }

      // TODO: change this to api return url image
      const urlImage = await toBase64(file);

      if (urlImage) {
        editor.value?.chain().setImage({ src: urlImage }).run();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor_container {
  margin: 40px auto;
  outline: 1px solid #c7c7c7;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  display: flex;
  // justify-content: space-between;
  flex-direction: column;
  background-color: white;
}

.editor__toolbar {
  @apply bg-gray-800 px-3 py-2 flex gap-1 items-center sticky top-0 z-10;

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

.position-handle {
  @apply shadow rounded;
  @apply p-1;
  @apply flex gap-2;

  background-color: white;
  transition: opacity 0.3s ease;
  button {
    @apply rounded px-1;
    text-align: center;
  }
}
</style>
