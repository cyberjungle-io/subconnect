import { FaColumns, FaFont, FaImage, FaChartBar, FaTable, FaPlayCircle, FaSquare, FaHeading } from 'react-icons/fa';

export const componentTypes = {
  CONTAINER: 'CONTAINER',
  ROW: 'ROW',
  COLUMN: 'COLUMN',
  HEADING: 'HEADING',
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  BUTTON: 'BUTTON',
  CHART: 'CHART',
  TABLE: 'TABLE',
  VIDEO: 'VIDEO'
};

export const componentConfig = {
  [componentTypes.CONTAINER]: {
    name: 'Container',
    icon: FaSquare,
    acceptsChildren: true,
    defaultSize: { width: 300, height: 200 }
  },
  [componentTypes.ROW]: {
    name: 'Row',
    icon: FaColumns,
    acceptsChildren: true,
    defaultSize: { width: '100%', height: 300 }
  },
  [componentTypes.COLUMN]: {
    name: 'Column',
    icon: FaColumns,
    acceptsChildren: true,
    defaultSize: { width: 200, height: '100%' }
  },
  [componentTypes.HEADING]: {
    name: 'Heading',
    icon: FaHeading,
    acceptsChildren: false,
    defaultContent: 'Heading',
    defaultProps: {
      level: 'h1',
      color: '#000000',
      bold: false,
      italic: false,
    }
  },
  [componentTypes.TEXT]: {
    name: 'Text',
    icon: FaFont,
    acceptsChildren: false,
    defaultContent: 'Enter your text here'
  },
  
  [componentTypes.IMAGE]: {
    name: 'Image',
    icon: FaImage,
    acceptsChildren: false,
    defaultSize: { width: 200, height: 200 },
    defaultContent: 'https://via.placeholder.com/200'
  },
  [componentTypes.BUTTON]: {
    name: 'Button',
    icon: FaSquare,
    acceptsChildren: false,
    defaultContent: 'Click me'
  },
  [componentTypes.CHART]: {
    name: 'Chart',
    icon: FaChartBar,
    acceptsChildren: false,
    defaultSize: { width: 400, height: 300 },
    defaultChartConfig: {
      chartType: 'line',
      dataKey: 'value',
      nameKey: 'name',
      showLegend: false,
      legendPosition: 'bottom',
      data: [
        { name: 'A', value: 400 },
        { name: 'B', value: 300 },
        { name: 'C', value: 200 },
        { name: 'D', value: 278 },
        { name: 'E', value: 189 },
      ]
    },
    chartTypes: ['line', 'bar', 'area', 'pie']
  },
  [componentTypes.TABLE]: {
    name: 'Table',
    icon: FaTable,
    acceptsChildren: false,
    defaultSize: { width: 300, height: 200 },
    defaultContent: 'Table Placeholder'
  },
  [componentTypes.VIDEO]: {
    name: 'Video',
    icon: FaPlayCircle,
    acceptsChildren: false,
    defaultSize: { width: 300, height: 200 },
    defaultContent: 'Video Placeholder'
  },
};