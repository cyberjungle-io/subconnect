import React from "react";

const HeadingRenderer = ({ component }) => {
  const { props = {}, style = {} } = component;
  const HeadingTag = `h${props.level.charAt(1)}`;

  const getResponsiveStyles = () => {
    const { responsiveHide, responsiveFontSize } = props;
    return `
      @media (max-width: 640px) {
        ${responsiveHide.mobile ? 'display: none;' : ''}
        font-size: ${responsiveFontSize.mobile};
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        ${responsiveHide.tablet ? 'display: none;' : ''}
        font-size: ${responsiveFontSize.tablet};
      }
      @media (min-width: 1025px) {
        ${responsiveHide.desktop ? 'display: none;' : ''}
        font-size: ${responsiveFontSize.desktop};
      }
    `;
  };

  const headingStyle = {
    fontFamily: props.fontFamily,
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle,
    textDecoration: props.textDecoration,
    textTransform: props.textTransform,
    color: props.color,
    backgroundColor: props.backgroundColor,
    textAlign: props.textAlign,
    verticalAlign: props.verticalAlign,
    textIndent: props.textIndent,
    lineHeight: props.lineHeight,
    letterSpacing: props.letterSpacing,
    wordSpacing: props.wordSpacing,
    textShadow: props.textShadow,
    margin: props.margin,
    padding: props.padding,
    width: style.width || props.width,
    height: style.height || props.height,
    ...style // Include any additional styles from the component's style object
  };

  const handleClick = () => {
    if (props.clickAction === 'smoothScroll') {
      // Implement smooth scroll logic here
      const targetElement = document.querySelector(props.scrollTarget);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (props.clickAction === 'openModal') {
      // Implement open modal logic here
      // This would typically involve dispatching an action to show a modal
      console.log('Open modal action triggered');
    }
  };

  return (
    <>
      <style>
        {getResponsiveStyles()}
      </style>
      <HeadingTag 
        style={headingStyle}
        onClick={handleClick}
        className={`heading-component ${props.hoverEffect !== 'none' ? `hover-effect-${props.hoverEffect}` : ''}`}
      >
        {component.content || 'Heading'}
      </HeadingTag>
    </>
  );
};

export default HeadingRenderer;