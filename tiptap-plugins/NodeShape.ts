import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { NodeSquare } from "#components";

export default Node.create({
  name: "nodeSquare",

  group: "block",

  content: "inline*",
  draggable: true,

  parseHTML() {
    return [
      {
        tag: "node-square",
      },
    ];
  },

  addAttributes() {
    return {
      width: {
        default: "100px",
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: "auto",
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["node-square", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeSquare);
  },
});
