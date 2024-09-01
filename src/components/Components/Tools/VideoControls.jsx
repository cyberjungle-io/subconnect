import React, { useState, useEffect } from 'react';

const VideoControls = ({ style, onStyleChange }) => {
  const [src, setSrc] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (style) {
      setSrc(style.src || '');
      setAutoplay(style.autoplay || false);
      setControls(style.controls !== false);
      setLoop(style.loop || false);
      setMuted(style.muted || false);
    }
  }, [style]);

  const handleChange = (property, value) => {
    onStyleChange({ [property]: value });
  };

  const renderCheckbox = (label, checked, onChange) => (
    <div className="mb-2">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Video Controls</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="text"
            value={src}
            onChange={(e) => handleChange('src', e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter video URL"
          />
        </div>
        {renderCheckbox('Autoplay', autoplay, (checked) => handleChange('autoplay', checked))}
        {renderCheckbox('Show Controls', controls, (checked) => handleChange('controls', checked))}
        {renderCheckbox('Loop', loop, (checked) => handleChange('loop', checked))}
        {renderCheckbox('Muted', muted, (checked) => handleChange('muted', checked))}
      </div>
    </div>
  );
};

export default VideoControls;