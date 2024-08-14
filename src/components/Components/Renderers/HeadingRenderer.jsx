import React, { useState } from "react";

const HeadingRenderer = ({ component, globalSettings }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { props = {}, style = {} } = component;
  const HeadingTag = `h${props.level.charAt(1)}`;

  const getHoverStyle = () => {
    if (isHovered) {
      switch (props.hoverEffect) {
        case 'underline':
          return { textDecoration: 'underline' };
        case 'color':
          return { color: 'some-hover-color' };
        case 'scale':
          return { transform: 'scale(1.05)' };
        default:
          return {};
      }
    }
    return {};
  };

  const headingStyle = {
    ...style,
    textAlign: style.textAlign || 'left',
    fontSize: style.fontSize || globalSettings.generalComponentStyle.fontSize,
    margin: 0,
    fontFamily: props.fontFamily || globalSettings.generalComponentStyle.fontFamily,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle,
    textDecoration: props.textDecoration,
    color: props.color || globalSettings.generalComponentStyle.color,
    lineHeight: props.lineHeight,
    letterSpacing: props.letterSpacing,
    wordSpacing: props.wordSpacing,
    textShadow: `${props.textShadowX}px ${props.textShadowY}px ${props.textShadowBlur}px ${props.textShadowColor}`,
    padding: props.padding,
    width: style.width || props.width,
    height: style.height || props.height,
    ...getHoverStyle(),
  };

  const handleClick = () => {
    if (props.clickAction === 'smoothScroll') {
      const targetElement = document.querySelector(props.scrollTarget);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (props.clickAction === 'openModal') {
      console.log('Open modal action triggered');
    }
  };

  return (
    <HeadingTag 
      style={headingStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`heading-component`}
    >
      {component.content || 'Heading'}
    </HeadingTag>
  );
};

export default HeadingRenderer;