<template>
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
import { PAGE_BREAK_FORMAT, PAPER_HEIGHT, SPARATOR_HEIGHT } from "~/constants";

const content = ref("");
const tiptap = ref();

const minHeight = computed(() => {
  const page = content.value.split(PAGE_BREAK_FORMAT).length;
  //   console.log(
  //     page,
  //     heightPaper,
  //     content.value.split(PAGE_BREAK_FORMAT),
  //     content.value,
  //     (page - 1) * 24
  //   );

  const maxEditorHeight =
    PAPER_HEIGHT + (page - 1) * (PAPER_HEIGHT + SPARATOR_HEIGHT); // Batas tinggi konten editor

  return `${maxEditorHeight}px`;
});
</script>

<style scoped></style>
