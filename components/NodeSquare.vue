<template>
  <node-view-wrapper
    class="custom-shape"
    :style="{ ...props.node.attrs, width, height }"
  >
    <div class="vue-component">
      <div
        class="drag-handle"
        contenteditable="false"
        draggable="true"
        data-drag-handle
      />
      <node-view-content class="content" />
      <div className="resize-trigger" @mousedown="handler"><IconResize /></div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

const props = defineProps(nodeViewProps);

const width = computed(() =>
  typeof props.node.attrs.width === "number"
    ? `${props.node.attrs.width}px`
    : props.node.attrs.width
);
const height = computed(() =>
  typeof props.node.attrs.height === "number"
    ? `${props.node.attrs.height}px`
    : props.node.attrs.height
);

function handler(mouseDownEvent: MouseEvent) {
  const parent = (mouseDownEvent.target as HTMLElement).closest(
    ".custom-shape"
  );
  const shape = parent?.querySelector("div.vue-component") ?? null;

  if (shape === null) return;
  const startSize = { x: shape.clientWidth, y: shape.clientHeight };
  const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

  function onMouseMove(mouseMoveEvent: MouseEvent) {
    props.updateAttributes({
      width: startSize.x - startPosition.x + mouseMoveEvent.pageX,
      height: startSize.y - startPosition.y + mouseMoveEvent.pageY,
    });
  }
  function onMouseUp() {
    document.body.removeEventListener("mousemove", onMouseMove);
  }

  document.body.addEventListener("mousemove", onMouseMove);
  document.body.addEventListener("mouseup", onMouseUp, { once: true });
}

// function handleClick() {
//   alert('dasdas');
// }
</script>

<style lang="scss">
.vue-component {
  position: relative;
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  background: #faf594;
  border-radius: 0.5rem;

  .resize-trigger {
    position: absolute;
    right: -6px;
    bottom: -9px;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #3259a5;
    cursor: nwse-resize;
    z-index: 200;
  }
  &:hover .resize-trigger {
    opacity: 1;
  }
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
