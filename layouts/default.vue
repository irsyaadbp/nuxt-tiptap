<template>
  <div class="min-h-full">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          {{ route.meta.title }}
        </h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl py-6 px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped></style>
