<template>
  <node-view-wrapper>
    <div class="vue-component">
      <div
        class="drag-handle"
        contenteditable="false"
        draggable="true"
        data-drag-handle
      />
      <node-view-content class="content" />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

defineProps(nodeViewProps);
</script>

<style lang="scss">
.vue-component {
  position: relative;
  padding: 0.5rem;
  width: 100px;
  //   cursor: grab;
  background: #faf594;
  border-radius: 0.5rem;
}
.content {
  padding: 0.5rem;
  //   border: 2px dashed #0d0d0d20;

  overflow-y: auto;
  border-radius: 0.5rem;
}
.drag-handle {
  flex: 0 0 auto;
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: 0.5rem;
  margin-right: 0.5rem;
  cursor: grab;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><path fill-opacity="0.2" d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>
