<template>
  <!-- <NgihuyEditor v-model="content" :upload-image-fn="onUploadImage" /> -->
  <div v-for="(c, i) in content">
    <NgihuyEditor
      :id="`ngihuy-${i}`"
      v-model="content[i]"
      :upload-image-fn="onUploadImage"
      :editor-index="i"
      @set-active="onSetActive"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Tiptap Editor",
});

const content = ref([""]);
const editorActive = ref();

watch(content.value, (newValue, oldValue) => {
  const contentHeight =
    document
      .getElementById(`ngihuy-${editorActive.value}`)
      ?.getElementsByClassName("ProseMirror")?.[0]?.clientHeight || 0;

  // if contentHeight >= 1032px && editorActive is last of array index && click enter
  if (
    contentHeight >= 1032 &&
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
</script>

<style scoped></style>
