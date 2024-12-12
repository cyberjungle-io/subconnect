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
} from "react-icons/fa";

const isLightColor = (color) => {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
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
                  const themeButtons = colorTheme.length === 0 ? [
                    {
                      text: "black",
                      command: "set border color to black",
                      type: "command",
                      icon: FaPalette,
                      className: buttonClass,
                      style: {
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        minWidth: '60px',
                        textAlign: 'center'
                      }
                    },
                    {
                      text: "gray",
                      command: "set border color to gray",
                      type: "command",
                      icon: FaPalette,
                      className: buttonClass,
                      style: {
                        backgroundColor: '#808080',
                        color: '#ffffff',
                        minWidth: '60px',
                        textAlign: 'center'
                      }
                    },
                    {
                      text: "blue",
                      command: "set border color to blue",
                      type: "command",
                      icon: FaPalette,
                      className: buttonClass,
                      style: {
                        backgroundColor: '#0000ff',
                        color: '#ffffff',
                        minWidth: '60px',
                        textAlign: 'center'
                      }
                    }
                  ] : colorTheme.map(color => ({
                    text: color.name,
                    command: `set border color to ${color.value}`,
                    type: "command",
                    icon: FaPalette,
                    className: `${buttonClass} relative`,
                    style: {
                      backgroundColor: color.value,
                      color: isLightColor(color.value) ? '#000000' : '#ffffff',
                      minWidth: '60px',
                      textAlign: 'center'
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
                        minWidth: '60px',
                        textAlign: 'center'
                      }
                    }
                  ];
                }
              }
            ]
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
            className: "flex gap-1",
            options: [
              {
                text: "subtle",
                command: "add subtle outer shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
              },
              {
                text: "medium",
                command: "add medium outer shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
              },
              {
                text: "pronounced",
                command: "add pronounced outer shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
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
            className: "flex gap-1",
            options: [
              {
                text: "subtle",
                command: "add subtle inner shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
              },
              {
                text: "medium",
                command: "add medium inner shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
              },
              {
                text: "deep",
                command: "add deep inner shadow",
                type: "command",
                icon: FaCloudSun,
                className: buttonClass,
              },
            ],
          },
          {
            text: "remove shadow",
            type: "command",
            icon: FaTimes,
            className: buttonClass,
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
