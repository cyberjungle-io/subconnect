import React from 'react';
import BasicTextControls from './BasicTextControls';
import ColorPicker from '../../common/ColorPicker';

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

  const handleTaskBackgroundChange = (color) => {
    onStyleChange({
      ...style,
      taskBackgroundColor: color,
    });
  };

  const handleTaskTextStyleChange = (newTaskStyle) => {
    onStyleChange({
      ...style,
      taskTextColor: newTaskStyle.color,
      taskFontSize: newTaskStyle.fontSize,
      taskFontFamily: newTaskStyle.fontFamily,
      taskFontWeight: newTaskStyle.fontWeight,
      taskFontStyle: newTaskStyle.fontStyle,
      taskTextDecoration: newTaskStyle.textDecoration,
    });
  };

  // Extract task-specific text styles
  const taskTextStyle = {
    color: style.taskTextColor,
    fontSize: style.taskFontSize,
    fontFamily: style.taskFontFamily,
    fontWeight: style.taskFontWeight,
    fontStyle: style.taskFontStyle,
    textDecoration: style.taskTextDecoration,
  };

  const handleAccentColorChange = (color) => {
    onStyleChange({
      ...style,
      accentColor: color,
    });
  };

  const handleAddButtonColorChange = (color) => {
    onStyleChange({
      ...style,
      addButtonColor: color,
    });
  };

  const handleAddButtonBgColorChange = (color) => {
    onStyleChange({
      ...style,
      addButtonBgColor: color,
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
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Title Underline Color</label>
          <ColorPicker
            color={style.accentColor || '#4a90e2'}
            onChange={handleAccentColorChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Add Button Color</label>
          <ColorPicker
            color={style.addButtonColor || '#ffffff'}
            onChange={handleAddButtonColorChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Add Button Background</label>
          <ColorPicker
            color={style.addButtonBgColor || '#4a90e2'}
            onChange={handleAddButtonBgColorChange}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Style</h3>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
          <ColorPicker
            color={style.taskBackgroundColor || '#ffffff'}
            onChange={handleTaskBackgroundChange}
          />
        </div>
        
        <div className="mt-4">
          <BasicTextControls
            style={taskTextStyle}
            onStyleChange={handleTaskTextStyleChange}
            label="Task Text"
            hideAlignment={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoControls;

