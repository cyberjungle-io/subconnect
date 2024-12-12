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
  FaGripHorizontal
} from 'react-icons/fa';

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
            className: headerClass
          },
          {
            text: "horizontal",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass
          },
          {
            text: "vertical",
            type: "command",
            icon: FaArrowsAltV,
            className: buttonClass
          },
          {
            text: "Wrap",
            type: "info",
            icon: FaArrowsAlt,
            className: headerClass
          },
          {
            text: "wrap",
            type: "command",
            icon: FaArrowsAltH,
            className: buttonClass
          },
          {
            text: "no wrap",
            type: "command",
            icon: FaGripLines,
            className: buttonClass
          },
          {
            text: "Justify Content",
            type: "info",
            icon: FaWrench,
            className: headerClass
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines,
            className: buttonClass
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns,
            className: buttonClass
          },
          {
            text: "evenly",
            type: "command",
            icon: FaGripLinesVertical,
            className: buttonClass
          },
          {
            text: "Align Items",
            type: "info",
            icon: FaWrench,
            className: headerClass
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt,
            className: buttonClass
          },
          {
            text: "baseline",
            type: "command",
            icon: FaGripLines,
            className: buttonClass
          },
          {
            text: "Align Content",
            type: "info",
            icon: FaWrench,
            className: headerClass
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft,
            className: buttonClass
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter,
            className: buttonClass
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight,
            className: buttonClass
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt,
            className: buttonClass
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines,
            className: buttonClass
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns,
            className: buttonClass
          }
        ]
      },
      {
        text: "Size",
        type: "category",
        icon: FaExpand,
        options: [
          {
            text: "make it bigger",
            type: "command",
          },
          {
            text: "make it smaller",
            type: "command",
          },
          {
            text: "set width to 100%",
            type: "command",
          },
          {
            text: "set height to auto",
            type: "command",
          }
        ]
      },
      {
        text: "Spacing",
        type: "category",
        icon: FaArrowsAlt,
        options: [
          {
            text: "add padding",
            type: "command",
          },
          {
            text: "remove padding",
            type: "command",
          },
          {
            text: "add gap between items",
            type: "command",
          },
          {
            text: "remove gap",
            type: "command",
          }
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
      }
    ];
  }
} 