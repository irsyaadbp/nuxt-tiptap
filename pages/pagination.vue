<template>
  <button
    class="bg-blue-600 px-4 py-2 rounded text-white mb-4"
    @click="handleUpload"
  >
    Upload
  </button>

  <!-- <div v-if="result" v-html="result" class="border-2 mb-6 p-4"></div> -->
  <div class="min-h-screen bg-slate-200 p-4">
    <div
      class="bg-white"
      :style="{ minHeight }"
      @click="tiptap.editor?.chain().focus('end')"
    >
      <PaginationEditor ref="tiptap" v-model="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import mammoth from "mammoth";
import { PAGE_BREAK_FORMAT, PAPER_HEIGHT, SPARATOR_HEIGHT } from "~/constants";
// const fileDoc = ref();
const content = ref("");
const tiptap = ref();
const result = ref();

const { files, open, reset, onChange } = useFileDialog();

function transformElement(element) {
  if (element.children) {
    const children = (element.children || [])?.map(transformElement);
    element = {
      ...element,
      children: children,
      styleName: `${element.styleName || "Paragraph"}${
        element.alignment ? ` ${element.alignment}` : ""
      }`,
    };
  }

  // if (element.type === "paragraph") {
  //   element = transformParagraph(element);
  // }

  // console.log({ element });

  return element;
}

function transformParagraph(element) {
  return {
    ...element,
    styleName:
      element.styleName ||
      `Paragraph${element.styleName}${
        element.alignment ? ` ${element.alignment}` : ""
      }`,
  };
}

onChange((files) => {
  /** do something with files */

  if (files && files[0]) {
    const file = files[0];

    if (
      ["application/msword", "officedocument"].find((type) =>
        file.type.includes(type)
      )
    ) {
      fileToByteArray(file).then((arrayBuffer) => {
        mammoth
          .convertToHtml(
            { arrayBuffer: arrayBuffer as ArrayBuffer },
            {
              ignoreEmptyParagraphs: false,
              transformDocument: transformElement,
              styleMap: [
                "p[style-name='Paragraph center'] => p.text-center",
                "p[style-name='Paragraph left'] => p.text-left",
                "p[style-name='Paragraph right'] => p.text-right",
                "p[style-name='Paragraph justify'] => p.text-justify",
                "p[style-name='heading 1 center'] => h1.text-center",
                "p[style-name='heading 1 left'] => h1.text-left",
                "p[style-name='heading 1 right'] => h1.text-right",
                "p[style-name='heading 1 justify'] => h1.text-justify",
                "p[style-name='heading 2 center'] => h2.text-center",
                "p[style-name='heading 2 left'] => h2.text-left",
                "p[style-name='heading 2 right'] => h2.text-right",
                "p[style-name='heading 2 justify'] => h2.text-justify",
              ],
            }
          )
          .then((res) => {
            // result.value = res.value;

            const replaceData = [
              ['class="text-center"', 'style="text-align: center"'],
              ['class="text-left"', 'style="text-align: left"'],
              ['class="text-right"', 'style="text-align: right"'],
              ['class="text-justify"', 'style="text-align: justify"'],
            ];
            let docsHtml = res.value;
            replaceData.forEach(([rawValue, replaceValue]) => {
              docsHtml = docsHtml.replaceAll(rawValue, replaceValue);
            });

            tiptap.value.editor.commands.setContent(docsHtml || "", true);
          });
      });
      //   fileDoc.value = file;
    }
  }
});

function fileToByteArray(file: any) {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();
      let fileByteArray: any[] = [];
      reader.readAsArrayBuffer(file);
      reader.onloadend = (evt: any) => {
        if (evt.target.readyState == FileReader.DONE) {
          let arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (const byte of array) {
            fileByteArray.push(byte);
          }
        }
        resolve(fileByteArray);
      };
    } catch (e) {
      reject(e);
    }
  });
}
function handleUpload() {
  reset();
  open();
}

const minHeight = computed(() => {
  const page = content.value.split(PAGE_BREAK_FORMAT).length;

  const maxEditorHeight =
    PAPER_HEIGHT + (page - 1) * (PAPER_HEIGHT + SPARATOR_HEIGHT); // Batas tinggi konten editor

  return `${maxEditorHeight}px`;
});
</script>

<style scoped></style>
