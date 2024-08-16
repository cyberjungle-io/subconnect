import { FaColumns, FaFont, FaImage, FaChartBar, FaTable, FaPlayCircle, FaSquare, FaHeading, FaChalkboard } from 'react-icons/fa';

export const componentTypes = {
  FLEX_CONTAINER: 'FLEX_CONTAINER',
  HEADING: 'HEADING',
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  BUTTON: 'BUTTON',
  CHART: 'CHART',
  TABLE: 'TABLE',
  VIDEO: 'VIDEO',
  WHITEBOARD: 'WHITEBOARD',
};

export const componentConfig = {
  [componentTypes.FLEX_CONTAINER]: {
    name: 'Flex Container',
    icon: FaColumns,
    acceptsChildren: true,
    defaultSize: { width: '100%', height: 'auto' },
    defaultProps: {
      direction: 'row',
      wrap: 'nowrap',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: '0px',
      borderRadius: '4px'
    }
  },
  [componentTypes.HEADING]: {
    name: 'Heading',
    icon: FaHeading,
    acceptsChildren: false,
    defaultContent: 'Heading',
    defaultProps: {
      level: 'h1',
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textTransform: 'none',
      color: '#000000',
      backgroundColor: 'transparent',
      textAlign: 'left',
      textIndent: '0px',
      lineHeight: '1.2',
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      textShadow: 'none',
      margin: '0px',
      padding: '0px',
      width: 'auto',
      height: 'auto',
      hoverEffect: 'none',
      clickAction: 'none',
      responsiveHide: {
        mobile: false,
        tablet: false,
        desktop: false
      },
      responsiveFontSize: {
        mobile: '24px',
        tablet: '28px',
        desktop: '32px'
      },
      borderRadius: '4px'
    },
    style: {
      textAlign: 'left',
      fontSize: '2rem',
      verticalAlign: 'top',
      // ... (keep other style properties)
    }
  },
  [componentTypes.TEXT]: {
    name: 'Text',
    icon: FaFont,
    acceptsChildren: false,
    defaultContent: 'Enter your text here',
    defaultProps: {
      borderRadius: '4px'
    }
  },
  
  [componentTypes.IMAGE]: {
    name: 'Image',
    icon: FaImage,
    acceptsChildren: false,
    defaultSize: { width: '200px', height: 'auto' },
    defaultContent: 'https://via.placeholder.com/200',
    defaultProps: {
      objectFit: 'contain',
      alt: 'Image description',
      shape: 'rectangle',
      keepAspectRatio: true,
      borderRadius: '4px',
      borderRadiusUnit: 'px',
      boxShadowX: '0',
      boxShadowY: '0',
      boxShadowBlur: '0',
      boxShadowColor: '#000000',
    },
    style: {
      width: '200px',
      height: 'auto',
      minWidth: 'auto',
      minHeight: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'inline-block',
      flexGrow: '0',
      flexShrink: '0',
      flexBasis: 'auto',
      overflow: 'hidden',
    }
  },
  [componentTypes.BUTTON]: {
    name: 'Button',
    icon: FaSquare,
    acceptsChildren: false,
    defaultContent: 'Click me',
    defaultProps: {
      borderRadius: '4px'
    }
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
    chartTypes: ['line', 'bar', 'area', 'pie'],
    defaultProps: {
      borderRadius: '4px'
    }
  },
  [componentTypes.TABLE]: {
    name: 'Table',
    icon: FaTable,
    acceptsChildren: false,
    defaultSize: { width: 300, height: 200 },
    defaultContent: 'Table Placeholder',
    defaultProps: {
      borderRadius: '4px'
    }
  },
  [componentTypes.VIDEO]: {
    name: 'Video',
    icon: FaPlayCircle,
    acceptsChildren: false,
    defaultSize: { width: 560, height: 315 },
    defaultContent: '',
    defaultProps: {
      youtubeUrl: '',
      autoplay: false,
      controls: true,
      loop: false,
      mute: false,
      startTime: 0,
      endTime: 0,
      borderRadius: '4px'
    },
    sanitizeUrl: (url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      return youtubeRegex.test(url) ? url : '';
    }
  },
  [componentTypes.WHITEBOARD]: {
    name: 'Whiteboard',
    icon: FaChalkboard,
    acceptsChildren: false,
    defaultSize: { width: 500, height: 300 },
    defaultProps: {
      backgroundColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      borderRadius: '4px'
    }
  },
};