<template>
  <p class="mb-2">
    You can see all code in
    <a
      href="https://github.com/irsyaadbp/nuxt-tiptap"
      target="_blank"
      rel="noopener noreferrer"
      class="underline font-semibold"
    >
      this github
    </a>
  </p>
  <BasicEditor v-model="content" :upload-image-fn="onUploadImage" />
</template>

<script setup lang="ts">
definePageMeta({
  title: "Tiptap Editor",
});

const content = ref(`<p>
          This is still the text editor you’re used to, but enriched with node views.
        </p>
        <node-square>
        </node-square>
        <p>
          Did you see that? That’s a Vue component. We are really living in the future.
        </p>`);

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
