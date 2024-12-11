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
    return [
      {
        text: "Layout",
        type: "category",
        icon: FaLayerGroup,
        options: [
          {
            text: "Direction",
            type: "info",
            icon: FaArrowRight
          },
          {
            text: "row",
            type: "command",
            icon: FaArrowsAltH
          },
          {
            text: "column",
            type: "command",
            icon: FaArrowsAltV
          },
          {
            text: "Wrap",
            type: "info",
            icon: FaArrowsAlt
          },
          {
            text: "wrap",
            type: "command",
            icon: FaArrowsAltH
          },
          {
            text: "no wrap",
            type: "command",
            icon: FaGripLines
          },
          {
            text: "Justify Content",
            type: "info",
            icon: FaWrench
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns
          },
          {
            text: "evenly",
            type: "command",
            icon: FaGripLinesVertical
          },
          {
            text: "Align Items",
            type: "info",
            icon: FaWrench
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt
          },
          {
            text: "baseline",
            type: "command",
            icon: FaGripLines
          },
          {
            text: "Align Content",
            type: "info",
            icon: FaWrench
          },
          {
            text: "start",
            type: "command",
            icon: FaAlignLeft
          },
          {
            text: "center",
            type: "command",
            icon: FaAlignCenter
          },
          {
            text: "end",
            type: "command",
            icon: FaAlignRight
          },
          {
            text: "stretch",
            type: "command",
            icon: FaExpandAlt
          },
          {
            text: "between",
            type: "command",
            icon: FaGripLines
          },
          {
            text: "around",
            type: "command",
            icon: FaColumns
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