<template>
  <NodeViewWrapper
    as="img"
    v-bind="attrs"
    :draggable="true"
    :data-drag-handle="true"
    ref="resizableImg"
    id="resizableImg"
    :style="{ width, height, ...position, ...display }"
  >
  </NodeViewWrapper>
</template>
<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import type { Position, Display } from "./ImageResizeable";
const props = defineProps(nodeViewProps);

const positionAttrs: Record<Position, object> = {
  left: {},
  center: { margin: "0 auto" },
  right: { "margin-left": "auto", "margin-right": 0 },
};

const displayAttrs: Record<Display, object> = {
  block: { display: "block" },
  "float-left": { float: "left" },
  "float-right": { float: "right" },
};

const position = computed(
  () => positionAttrs[props.node.attrs.position as Position]
);

const display = computed(
  () => displayAttrs[props.node.attrs.display as Display]
);

const attrs = computed(() => {
  const { width, height, ...otherAttrs } = props.node.attrs;
  return otherAttrs;
});

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

const resizableImg = ref();

// const isDraggable = computed(() => props.node.attrs.isDraggable);

const refImage = computed(() => resizableImg.value?.$el as HTMLImageElement);
</script>
