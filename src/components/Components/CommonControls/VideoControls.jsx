import React from 'react';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';
import ComponentControls from './ComponentControls';

const VideoControls = ({ component, onUpdate }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    dispatch(updateComponent({
      id: component.id,
      updates: { props: { ...component.props, [name]: newValue } }
    }));
  };

  const handleStyleChange = (styleUpdates) => {
    dispatch(updateComponent({
      id: component.id,
      updates: { style: { ...component.style, ...styleUpdates } }
    }));
  };

  return (
    <div className="video-controls space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Video Controls</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
        <input
          type="text"
          name="youtubeUrl"
          value={component.props.youtubeUrl || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoplay"
          name="autoplay"
          checked={component.props.autoplay || false}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="autoplay" className="ml-2 block text-sm text-gray-900">
          Autoplay
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="controls"
          name="controls"
          checked={component.props.controls || false}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="controls" className="ml-2 block text-sm text-gray-900">
          Show Controls
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="loop"
          name="loop"
          checked={component.props.loop || false}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="loop" className="ml-2 block text-sm text-gray-900">
          Loop
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="mute"
          name="mute"
          checked={component.props.mute || false}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="mute" className="ml-2 block text-sm text-gray-900">
          Mute
        </label>
      </div>

      <ComponentControls style={component.style} onStyleChange={handleStyleChange} />
    </div>
  );
};

export default VideoControls;