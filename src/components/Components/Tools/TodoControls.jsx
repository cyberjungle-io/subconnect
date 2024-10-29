import React from 'react';
import BasicTextControls from './BasicTextControls';

const TodoControls = ({ style, props, onStyleChange, onPropsChange }) => {
  const handleTitleChange = (e) => {
    onPropsChange({ ...props, title: e.target.value });
  };

  // Extract title-specific styles
  const titleStyle = {
    color: style.titleColor || style.color,
    fontSize: style.titleFontSize,
    fontFamily: style.titleFontFamily,
    fontWeight: style.titleFontWeight,
    fontStyle: style.titleFontStyle,
    textDecoration: style.titleTextDecoration,
    textAlign: style.titleTextAlign,
  };

  const handleTitleStyleChange = (newTitleStyle) => {
    onStyleChange({
      ...style,
      titleColor: newTitleStyle.color,
      titleFontSize: newTitleStyle.fontSize,
      titleFontFamily: newTitleStyle.fontFamily,
      titleFontWeight: newTitleStyle.fontWeight,
      titleFontStyle: newTitleStyle.fontStyle,
      titleTextDecoration: newTitleStyle.textDecoration,
      titleTextAlign: newTitleStyle.textAlign,
    });
  };

  return (
    <div className="todo-controls">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Title</h3>
      <div className="control-section-content">
        <input
          type="text"
          value={props.title || ''}
          onChange={handleTitleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="mt-4">
        <BasicTextControls
          style={titleStyle}
          onStyleChange={handleTitleStyleChange}
          label=""
          hideAlignment={true}
        />
      </div>
    </div>
  );
};

export default TodoControls;

