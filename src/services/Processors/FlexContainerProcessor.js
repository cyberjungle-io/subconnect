import {
  FaExpand,
  FaArrowsAlt,
  FaBorderStyle,
  FaPalette,
  FaLayerGroup,
  FaMousePointer,
  FaArrowsAltH,
  FaArrowsAltV,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaExpandAlt,
  FaGripLines,
  FaGripLinesVertical,
  FaArrowRight,
  FaWrench,
  FaColumns,
  FaGripHorizontal,
  FaCompressAlt,
  FaCompress,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

export class FlexContainerProcessor {
  static getSuggestions() {
    const buttonClass = "text-xs px-1 py-1"; // Smaller text and padding
    const headerClass = "text-xs font-small text-gray-200"; // Changed from text-gray-600 to text-gray-400 for lighter headers

    return [
      {
        text: "Layout",
        type: "category",
        icon: FaLayerGroup,
        className: headerClass,
        options: [
          {
            text: "Direction",
            type: "info",
            icon: FaArrowRight,
            className: headerClass,
          },
          {
            text: "horizontal",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass,
          },
          {
            text: "vertical",
            type: "command",
            icon: FaArrowsAltV,
            className: buttonClass,
          },
          {
            text: "Wrap",
            type: "info",
            icon: FaArrowsAlt,
            className: headerClass,
          },
          {
            text: "wrap",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass,
          },
          {
            text: "no wrap",
            type: "command",
            icon: FaGripLines,
            className: buttonClass,
          },
          {
            text: "Justify Content",
            type: "info",
            icon: FaWrench,
            className: headerClass,
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass,
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass,
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass,
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines,
            className: buttonClass,
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns,
            className: buttonClass,
          },
          {
            text: "evenly",
            type: "command",
            icon: FaGripLinesVertical,
            className: buttonClass,
          },
          {
            text: "Align Items",
            type: "info",
            icon: FaWrench,
            className: headerClass,
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass,
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass,
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass,
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt,
            className: buttonClass,
          },
          {
            text: "baseline",
            type: "command",
            icon: FaGripLines,
            className: buttonClass,
          },
          {
            text: "Align Content",
            type: "info",
            icon: FaWrench,
            className: headerClass,
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass,
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass,
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass,
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt,
            className: buttonClass,
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines,
            className: buttonClass,
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns,
            className: buttonClass,
          },
        ],
      },
      {
        text: "Size",
        type: "category",
        icon: FaExpand,
        options: [
          {
            text: "fit to content",
            type: "command",
            icon: FaCompress,
            className: buttonClass,
          },
          {
            text: "fit vertical",
            type: "command",
            icon: FaArrowsAltV,
            className: buttonClass,
          },
          {
            text: "fit horizontal",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass,
          },
          {
            text: "make it bigger",
            type: "command",
            icon: FaExpandAlt,
            className: buttonClass,
          },
          {
            text: "make it smaller",
            type: "command",
            icon: FaCompressAlt,
            className: buttonClass,
          },
          {
            text: "set width to 100%",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass,
          },
          {
            text: "set height to auto",
            type: "command",
            icon: FaArrowsAltV,
            className: buttonClass,
            checkEnabled: (component) => component?.style?.height !== "auto",
          },
          {
            text: "set height to 200px",
            type: "command",
            icon: FaArrowsAltV,
            className: buttonClass,
            checkVisible: (component) => component?.style?.height === "auto",
          },
          {
            text: "set width to 300px",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass,
          },
        ],
      },
      {
        text: "Spacing",
        type: "category",
        icon: FaArrowsAlt,
        options: [
          {
            text: "Padding",
            type: "info",
            icon: FaExpandAlt,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-1",
            options: [
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "small",
                    type: "command",
                    icon: FaExpand,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    type: "command",
                    icon: FaExpand,
                    className: buttonClass,
                  },
                  {
                    text: "large",
                    type: "command",
                    icon: FaExpand,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "add 5px",
                    type: "command",
                    icon: FaPlus,
                    className: buttonClass,
                  },
                  {
                    text: "remove 5px",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                ],
              },
            ],
          },
          {
            text: "Margin",
            type: "info",
            icon: FaArrowsAlt,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-1",
            options: [
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "small",
                    type: "command",
                    icon: FaArrowsAlt,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    type: "command",
                    icon: FaArrowsAlt,
                    className: buttonClass,
                  },
                  {
                    text: "large",
                    type: "command",
                    icon: FaArrowsAlt,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "add 5px",
                    type: "command",
                    icon: FaPlus,
                    className: buttonClass,
                  },
                  {
                    text: "remove 5px",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                ],
              },
            ],
          },
          {
            text: "Gap",
            type: "info",
            icon: FaGripLines,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-1",
            options: [
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "small",
                    type: "command",
                    icon: FaGripLines,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    type: "command",
                    icon: FaGripLines,
                    className: buttonClass,
                  },
                  {
                    text: "large",
                    type: "command",
                    icon: FaGripLines,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "add 5px",
                    type: "command",
                    icon: FaPlus,
                    className: buttonClass,
                  },
                  {
                    text: "remove 5px",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        text: "Border",
        type: "category",
        icon: FaBorderStyle,
        options: [
          {
            text: "add border",
            type: "command",
          },
          {
            text: "remove border",
            type: "command",
          },
          {
            text: "make corners rounded",
            type: "command",
          },
          {
            text: "add shadow",
            type: "command",
          },
        ],
      },
      {
        text: "Background",
        type: "category",
        icon: FaPalette,
        options: [
          {
            text: "change background color",
            type: "command",
          },
          {
            text: "make transparent",
            type: "command",
          },
          {
            text: "add gradient",
            type: "command",
          },
        ],
      },
      {
        text: "Button",
        type: "category",
        icon: FaMousePointer,
        options: [
          {
            text: "make clickable",
            type: "command",
          },
          {
            text: "add hover effect",
            type: "command",
          },
          {
            text: "change cursor to pointer",
            type: "command",
          },
          {
            text: "add click animation",
            type: "command",
          },
        ],
      },
    ];
  }
}
