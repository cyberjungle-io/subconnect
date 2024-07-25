import React from "react";

const HeadingRenderer = ({ component }) => {
  const { props = {} } = component;
  const HeadingTag = props.level || 'h1';

  return (
    <HeadingTag
      style={{
        color: props.color || '#000000',
        fontWeight: props.bold ? 'bold' : 'normal',
        fontStyle: props.italic ? 'italic' : 'normal',
      }}
    >
      {component.content || 'Heading'}
    </HeadingTag>
  );
};

export default HeadingRenderer;