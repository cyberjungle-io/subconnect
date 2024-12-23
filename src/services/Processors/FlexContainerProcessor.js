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
  FaCloudSun,
  FaRegSquare,
  FaSquare,
  FaCaretDown,
  FaArrowUp,
  FaWater,
  FaAdjust,
  FaRegDotCircle,
  FaDotCircle,
  FaCircle,
  FaRegCircle,
  FaClock,
  FaHandPointer,
  FaICursor,
} from "react-icons/fa";
import { LayoutProcessor } from "./LayoutProcessor";
import { SizeProcessor } from "./SizeProcessor";

const isLightColor = (color) => {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g).map(Number);
  } else {
    return true; // Default to dark text for named colors
  }

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export class FlexContainerProcessor {
  static getSuggestions() {
    const buttonClass = "text-xs px-1 py-1"; // Smaller text and padding
    const headerClass = "text-xs font-small text-gray-200"; // Changed from text-gray-600 to text-gray-400 for lighter headers

    return [
      LayoutProcessor.getSuggestions(headerClass, buttonClass),
      SizeProcessor.getSuggestions(headerClass, buttonClass),
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
            text: "Border Width",
            type: "info",
            icon: FaBorderStyle,
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
                    command: "set border width to small",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    command: "set border width to medium",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                  {
                    text: "large",
                    command: "set border width to large",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "add 1px",
                    command: "add 1px to border",
                    type: "command",
                    icon: FaPlus,
                    className: buttonClass,
                  },
                  {
                    text: "remove 1px",
                    command: "remove 1px from border",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                  {
                    text: "remove border",
                    command: "remove border",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                ],
              },
            ],
          },
          {
            text: "Border Radius",
            type: "info",
            icon: FaBorderStyle,
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
                    command: "set border radius to small",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    command: "set border radius to medium",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                  {
                    text: "large",
                    command: "set border radius to large",
                    type: "command",
                    icon: FaBorderStyle,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "add 1px",
                    command: "add 1px to radius",
                    type: "command",
                    icon: FaPlus,
                    className: buttonClass,
                  },
                  {
                    text: "remove 1px",
                    command: "remove 1px from radius",
                    type: "command",
                    icon: FaTimes,
                    className: buttonClass,
                  },
                ],
              },
            ],
          },
          {
            text: "Border Color",
            type: "info",
            icon: FaPalette,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-1",
            options: [
              {
                type: "wrapper",
                className: "flex flex-wrap gap-1",
                options: (state) => {
                  const colorTheme = state?.colorTheme || [];

                  // Create array of theme colors
                  const themeButtons =
                    colorTheme.length === 0
                      ? [
                          {
                            text: "black",
                            command: "set border color to black",
                            type: "command",
                            icon: FaPalette,
                            className: buttonClass,
                            style: {
                              backgroundColor: "#000000",
                              color: "#ffffff",
                              minWidth: "60px",
                              textAlign: "center",
                            },
                          },
                          {
                            text: "gray",
                            command: "set border color to gray",
                            type: "command",
                            icon: FaPalette,
                            className: buttonClass,
                            style: {
                              backgroundColor: "#808080",
                              color: "#ffffff",
                              minWidth: "60px",
                              textAlign: "center",
                            },
                          },
                          {
                            text: "blue",
                            command: "set border color to blue",
                            type: "command",
                            icon: FaPalette,
                            className: buttonClass,
                            style: {
                              backgroundColor: "#0000ff",
                              color: "#ffffff",
                              minWidth: "60px",
                              textAlign: "center",
                            },
                          },
                        ]
                      : colorTheme.map((color) => ({
                          text: color.name,
                          command: `set border color to ${color.value}`,
                          type: "command",
                          icon: FaPalette,
                          className: `${buttonClass} relative`,
                          style: {
                            backgroundColor: color.value,
                            color: isLightColor(color.value)
                              ? "#000000"
                              : "#ffffff",
                            minWidth: "60px",
                            textAlign: "center",
                          },
                        }));

                  // Add custom color button
                  return [
                    ...themeButtons,
                    {
                      text: "custom",
                      command: "set border color to custom",
                      type: "command",
                      icon: FaPalette,
                      className: buttonClass,
                      style: {
                        minWidth: "60px",
                        textAlign: "center",
                      },
                    },
                  ];
                },
              },
            ],
          },
        ],
      },
      {
        text: "Shadow",
        type: "category",
        icon: FaCloudSun,
        options: [
          {
            text: "Outer Shadow",
            type: "info",
            icon: FaCloudSun,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-2",
            options: [
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "subtle",
                    command: "add subtle outer shadow",
                    type: "command",
                    icon: FaRegSquare,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    command: "add medium outer shadow",
                    type: "command",
                    icon: FaSquare,
                    className: buttonClass,
                    style: { color: "#666666" },
                  },
                  {
                    text: "harsh",
                    command: "add harsh outer shadow",
                    type: "command",
                    icon: FaSquare,
                    className: buttonClass,
                    style: { color: "#000000" },
                  },
                  {
                    text: "floating",
                    command: "add floating outer shadow",
                    type: "command",
                    icon: FaArrowUp,
                    className: buttonClass,
                  },
                  {
                    text: "layered",
                    command: "add layered outer shadow",
                    type: "command",
                    icon: FaLayerGroup,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "X Offset",
                    type: "command",
                    icon: FaArrowsAltH,
                    className: buttonClass,
                    command: "customize outer shadow x-offset",
                  },
                  {
                    text: "Y Offset",
                    type: "command",
                    icon: FaArrowsAltV,
                    className: buttonClass,
                    command: "customize outer shadow y-offset",
                  },
                  {
                    text: "Blur",
                    type: "command",
                    icon: FaWater,
                    className: buttonClass,
                    command: "customize outer shadow blur",
                  },
                  {
                    text: "Spread",
                    type: "command",
                    icon: FaExpandAlt,
                    className: buttonClass,
                    command: "customize outer shadow spread",
                  },
                  {
                    text: "Color",
                    type: "command",
                    icon: FaPalette,
                    className: buttonClass,
                    command: "customize outer shadow color",
                  },
                  {
                    text: "Opacity",
                    type: "command",
                    icon: FaAdjust,
                    className: buttonClass,
                    command: "customize outer shadow opacity",
                  },
                ],
              },
            ],
          },
          {
            text: "Inner Shadow",
            type: "info",
            icon: FaCloudSun,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-col gap-2",
            options: [
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "subtle",
                    command: "add subtle inner shadow",
                    type: "command",
                    icon: FaRegDotCircle,
                    className: buttonClass,
                  },
                  {
                    text: "medium",
                    command: "add medium inner shadow",
                    type: "command",
                    icon: FaDotCircle,
                    className: buttonClass,
                  },
                  {
                    text: "deep",
                    command: "add deep inner shadow",
                    type: "command",
                    icon: FaCircle,
                    className: buttonClass,
                  },
                  {
                    text: "pressed",
                    command: "add pressed inner shadow",
                    type: "command",
                    icon: FaCompressAlt,
                    className: buttonClass,
                  },
                  {
                    text: "hollow",
                    command: "add hollow inner shadow",
                    type: "command",
                    icon: FaRegCircle,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "Blur",
                    type: "command",
                    icon: FaWater,
                    className: buttonClass,
                    command: "customize inner shadow blur",
                  },
                  {
                    text: "Spread",
                    type: "command",
                    icon: FaExpandAlt,
                    className: buttonClass,
                    command: "customize inner shadow spread",
                  },
                  {
                    text: "Color",
                    type: "command",
                    icon: FaPalette,
                    className: buttonClass,
                    command: "customize inner shadow color",
                  },
                  {
                    text: "Opacity",
                    type: "command",
                    icon: FaAdjust,
                    className: buttonClass,
                    command: "customize inner shadow opacity",
                  },
                ],
              },
            ],
          },
          {
            type: "wrapper",
            className: "mt-2 pt-2 border-t border-gray-200",
            options: [
              {
                text: "remove shadow",
                type: "command",
                icon: FaTimes,
                className: buttonClass,
              },
            ],
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
            text: "Page Navigation",
            type: "info",
            icon: FaArrowRight,
            className: headerClass,
          },
          {
            text: "enable page navigation",
            type: "command",
            icon: FaMousePointer,
            className: buttonClass,
            checkEnabled: (component) =>
              !component?.style?.enablePageNavigation,
          },
          {
            text: "change target page",
            type: "command",
            icon: FaArrowRight,
            className: buttonClass,
            checkEnabled: (component) => component?.style?.enablePageNavigation,
            command: "enable page navigation",
          },
          {
            text: "disable page navigation",
            type: "command",
            icon: FaTimes,
            className: buttonClass,
            checkEnabled: (component) => component?.style?.enablePageNavigation,
          },
          {
            text: "Hover Effects",
            type: "info",
            icon: FaAdjust,
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
                    text: "set hover animation",
                    type: "command",
                    icon: FaClock,
                    className: buttonClass,
                    command: "set hover animation",
                  },
                  {
                    text: "change hover color",
                    type: "command",
                    icon: FaPalette,
                    className: buttonClass,
                  },
                ],
              },
              {
                type: "wrapper",
                className: "flex gap-1",
                options: [
                  {
                    text: "change hover text color",
                    type: "command",
                    icon: FaPalette,
                    className: buttonClass,
                  },
                  {
                    text: "remove all effects",
                    type: "command",
                    icon: FaTimes,
                    className: `${buttonClass} text-red-600 hover:text-red-700`,
                    command: "remove all hover effects",
                  },
                ],
              },
            ],
          },
          {
            text: "Pointer Style",
            type: "info",
            icon: FaMousePointer,
            className: headerClass,
          },
          {
            type: "wrapper",
            className: "flex flex-wrap gap-1",
            options: [
              {
                text: "pointer",
                command: "set cursor to pointer",
                type: "command",
                icon: FaHandPointer,
                className: buttonClass,
              },
              {
                text: "default",
                command: "set cursor to default",
                type: "command",
                icon: FaMousePointer,
                className: buttonClass,
              },
              {
                text: "move",
                command: "set cursor to move",
                type: "command",
                icon: FaArrowsAlt,
                className: buttonClass,
              },
              {
                text: "text",
                command: "set cursor to text",
                type: "command",
                icon: FaICursor,
                className: buttonClass,
              },
            ],
          },
        ],
      },
    ];
  }
}
