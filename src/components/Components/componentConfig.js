import {
  FaColumns,
  FaFont,
  FaImage,
  FaChartBar,
  FaTable,
  FaPlayCircle,
  FaSquare,
  FaHeading,
  FaChalkboard,
  FaDatabase,
  FaClipboardList,
  FaListUl,
} from "react-icons/fa";

export const componentTypes = {
  FLEX_CONTAINER: "FLEX_CONTAINER",
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  CHART: "CHART",
  TABLE: "TABLE",
  VIDEO: "VIDEO",
  WHITEBOARD: "WHITEBOARD",
  QUERY_VALUE: "QUERY_VALUE",
  SAVED_COMPONENT: "SAVED_COMPONENT",
  KANBAN: "KANBAN",
  TODO: "TODO",
};

export const componentConfig = {
  [componentTypes.FLEX_CONTAINER]: {
    name: "Flex Container",
    icon: FaColumns,
    acceptsChildren: true,
    defaultSize: { width: "100%", height: "300px" },
    defaultProps: {
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      justifyContent: "flex-start",
      alignContent: "stretch",
      gap: "0px",
      borderRadius: "4px",
    },
  },
  [componentTypes.TEXT]: {
    name: "Text",
    icon: FaFont,
    acceptsChildren: false,
    defaultSize: { width: "100%", height: "50px" },
    defaultProps: {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textTransform: "none",
      color: "#000000",
      backgroundColor: "transparent",
      textAlign: "left",
      textIndent: "0px",
      lineHeight: "1.5",
      letterSpacing: "normal",
      wordSpacing: "normal",
      textShadow: "none",
      margin: "0px",
      padding: "0px",
      width: "auto",
      height: "auto",
      hoverEffect: "none",
      clickAction: "none",
      headingLevel: "p", // Add this for heading functionality
      responsiveHide: {
        mobile: false,
        tablet: false,
        desktop: false,
      },
      responsiveFontSize: {
        mobile: "14px",
        tablet: "16px",
        desktop: "16px",
      },
      borderRadius: "4px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    style: {
      textAlign: "left",
      fontSize: "16px",
      verticalAlign: "top",
      height: "50px",
      width: "100%",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      // ... (keep other style properties)
    },
  },
  [componentTypes.IMAGE]: {
    name: "Image",
    icon: FaImage,
    acceptsChildren: false,
    defaultSize: { width: "200px", height: "auto" },
    defaultContent: "https://via.placeholder.com/200",
    defaultProps: {
      objectFit: "contain",
      alt: "Image description",
      shape: "rectangle",
      keepAspectRatio: true,
      borderRadius: "4px",
      borderRadiusUnit: "px",
      boxShadowX: "0",
      boxShadowY: "0",
      boxShadowBlur: "0",
      boxShadowColor: "#000000",
    },
    style: {
      width: "200px",
      height: "auto",
      minWidth: "auto",
      minHeight: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
      display: "inline-block",
      flexGrow: "0",
      flexShrink: "0",
      flexBasis: "auto",
      overflow: "hidden",
    },
  },

  [componentTypes.CHART]: {
    name: "Chart",
    icon: FaChartBar,
    acceptsChildren: false,
    defaultSize: { width: "400px", height: "300px" },
    defaultChartConfig: {
      chartType: "line",
      dataKey: "value",
      nameKey: "name",
      showLegend: false,
      legendPosition: "bottom",
      data: [
        { name: "A", value: 400 },
        { name: "B", value: 900 },
        { name: "C", value: 200 },
        { name: "D", value: 278 },
        { name: "E", value: 189 },
      ],
    },
    chartTypes: ["line", "bar", "area", "pie"],
    defaultProps: {
      borderRadius: "4px",
    },
  },
  [componentTypes.TABLE]: {
    name: "Table",
    icon: FaTable,
    acceptsChildren: false,
    defaultSize: { width: "100%", height: "auto" },
    defaultProps: {
      columns: [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "value", header: "Value" },
      ],
      data: [
        { id: 1, name: "Sample Row 1", value: 100 },
        { id: 2, name: "Sample Row 2", value: 200 },
        { id: 3, name: "Sample Row 3", value: 300 },
      ],
      title: "Table Title",
      selectedQueryId: "",
      borderRadius: "4px",
    },
  },
  [componentTypes.VIDEO]: {
    name: "Video",
    icon: FaPlayCircle,
    acceptsChildren: false,
    defaultSize: { width: "560px", height: "315px" },
    defaultContent: "",
    defaultProps: {
      youtubeUrl: "",
      autoplay: false,
      controls: true,
      loop: false,
      mute: false,
      startTime: 0,
      endTime: 0,
      borderRadius: "4px",
    },
    sanitizeUrl: (url) => {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return youtubeRegex.test(url) ? url : "";
    },
  },
  [componentTypes.WHITEBOARD]: {
    name: "Whiteboard",
    icon: FaChalkboard,
    acceptsChildren: false,
    defaultSize: { width: "500px", height: "300px" },
    defaultProps: {
      backgroundColor: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 2,
      borderRadius: "4px",
    },
  },
  [componentTypes.QUERY_VALUE]: {
    name: "Query Value",
    icon: FaDatabase,
    acceptsChildren: false,
    defaultSize: { width: "auto", height: "auto" },
    defaultProps: {
      queryId: "",
      field: "",
      formatting: "none",
      borderRadius: "4px",
    },
  },
  [componentTypes.SAVED_COMPONENT]: {
    name: "Saved Component",
    icon: FaDatabase, // You can choose a different icon if you prefer
    acceptsChildren: true, // This might depend on the saved component's original type
    createComponent: (savedComponent) => {
      // This function will create a new component based on the saved component's data
      const baseConfig = componentConfig[savedComponent.type];
      return {
        ...baseConfig,
        ...savedComponent,
        type: savedComponent.type, // Use the original type
      };
    },
  },
  [componentTypes.KANBAN]: {
    name: "Kanban Board",
    icon: FaClipboardList,
    acceptsChildren: false,
    defaultSize: { width: "100%", height: "400px" },
    defaultProps: {
      columns: [
        { id: "col1", title: "To Do" },
        { id: "col2", title: "In Progress" },
        { id: "col3", title: "Done" },
      ],
      tasks: [],
      borderRadius: "4px",
    },
  },
  [componentTypes.TODO]: {
    name: "Todo List",
    icon: FaListUl,
    acceptsChildren: false,
    defaultSize: { width: "300px", height: "auto" },
    defaultProps: {
      title: "Todo List",
      tasks: [],
      borderRadius: "4px",
    },
  },
};
