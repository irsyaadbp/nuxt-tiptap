import Image from "@tiptap/extension-image";
import ImageComponent from "./ImageComponent.vue";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
export type Position = "left" | "center" | "right";
export type Display = "block" | "float-left" | "float-right";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ImageResizable: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: string | number;
        height?: string | number;
        position?: Position;
      }) => ReturnType;
      setPositionImage: (position: Position) => ReturnType;
      setDisplayImage: (position: Display) => ReturnType;
    };
  }
}

export default Image.extend({
  name: "ImageResizeable",
  addAttributes() {
    return {
      // Inherit all the attrs of the Image extension
      ...this.parent?.(),

      // New attrs
      width: {
        default: "300px",
        // tell them to render on the img tag
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
      position: {
        default: "left",
        renderHTML: (attributes) => {
          return {};
        },
      },
      display: {
        default: "block",
        renderHTML: (attributes) => {
          return {};
        },
      },

      // We'll use this to tell if we are going to drag the image
      // through the editor or if we are resizing it
      // isDraggable: {
      //   default: true,
      //   // We don't want it to render on the img tag
      //   renderHTML: (attributes) => {
      //     return {};
      //   },
      // },
    };
  },
  addCommands() {
    return {
      // Inherit all the commands of the Image extension.
      // This way we can add images as always:
      // this.editor.chain().focus()
      //      .setImage({
      //          src: 'https://source.unsplash.com/8xznAGy4HcY/800x400',
      //          width: '80',
      //          height: '40'
      //      })
      //      .run();
      ...this.parent?.(),

      // New command that is going to be called like:
      // this.editor.chain().focus().toggleResizable().run();
      // toggleResizable:
      //   () =>
      //   ({ tr }) => {
      //     const { node } = tr?.selection;

      //     if (node?.type?.name === "ImageResizable") {
      //       node.attrs.isResizable = !node.attrs.isResizable;
      //     }
      //   },

      setPositionImage:
        (props) =>
        ({ tr, commands, ...others }) => {
          // const { node } = tr;
          // const node = tr.doc;

          if ((tr.selection as any)?.node?.type?.name === "ImageResizeable") {
            // node.attrs.position = props;
            commands.updateAttributes("ImageResizeable", { position: props });
          }
        },
      setDisplayImage:
        (props) =>
        ({ tr, commands, ...others }) => {
          // const { node } = tr;
          // const node = tr.doc;

          if ((tr.selection as any)?.node?.type?.name === "ImageResizeable") {
            // node.attrs.position = props;
            commands.updateAttributes("ImageResizeable", { display: props });
          }
        },
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageComponent);
  },
});
