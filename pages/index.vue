<template>
  <BasicEditor v-model="content" :upload-image-fn="onUploadImage" />
</template>

<script setup lang="ts">
definePageMeta({
  title: "Tiptap Editor",
});

const content = ref("");

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
