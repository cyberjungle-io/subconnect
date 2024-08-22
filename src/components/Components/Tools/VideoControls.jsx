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

  return (
    <div className="control-section">
      <div className="control-section-content">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="text"
            value={src}
            onChange={(e) => handleChange('src', e.target.value)}
            className="w-full text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => handleChange('autoplay', e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs font-medium text-gray-700">Autoplay</span>
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={controls}
              onChange={(e) => handleChange('controls', e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs font-medium text-gray-700">Show Controls</span>
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => handleChange('loop', e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs font-medium text-gray-700">Loop</span>
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={muted}
              onChange={(e) => handleChange('muted', e.target.checked)}
              className="mr-2"
            />
            <span className="text-xs font-medium text-gray-700">Muted</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;