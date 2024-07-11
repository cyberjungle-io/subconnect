import { FaColumns, FaFont, FaImage, FaChartBar, FaTable, FaPlayCircle, FaSquare } from 'react-icons/fa';

export const componentTypes = {
  CONTAINER: 'CONTAINER',
  ROW: 'ROW',
  COLUMN: 'COLUMN',
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
    defaultSize: { width: '100%', height: 100 }
  },
  [componentTypes.COLUMN]: {
    name: 'Column',
    icon: FaColumns,
    acceptsChildren: true,
    defaultSize: { width: 200, height: '100%' }
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
    defaultSize: { width: 300, height: 200 },
    defaultContent: 'Chart Placeholder'
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
  }
};