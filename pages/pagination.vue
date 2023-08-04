<template>
  <button
    class="bg-blue-600 px-4 py-2 rounded text-white mb-4"
    @click="handleUpload"
  >
    Upload
  </button>

  <div v-if="result" v-html="result" class="border-2 mb-6 p-4"></div>
  <div class="min-h-screen bg-slate-200 p-4">
    <div
      class="bg-white"
      :style="{ minHeight }"
      @click="tiptap.editor?.chain().focus('end')"
    >
      <PaginationEditor ref="tiptap" v-model="content" />
    </div>
  </div>
  {{ content }}
</template>

<script setup lang="ts">
import mammoth from "mammoth";
import { PAGE_BREAK_FORMAT, PAPER_HEIGHT, SPARATOR_HEIGHT } from "~/constants";
// const fileDoc = ref();
const content = ref("");
const tiptap = ref();
const result = ref();

const { files, open, reset, onChange } = useFileDialog();

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
          .convertToHtml({ arrayBuffer: arrayBuffer as ArrayBuffer })
          .then((res) => {
            result.value = res.value;
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
