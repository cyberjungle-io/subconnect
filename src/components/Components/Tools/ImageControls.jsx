import React, { useState, useCallback } from 'react';
import { FaSearchPlus, FaSearchMinus, FaUpload, FaCode } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';
import SvgControls from './SvgControls';

const ImageControls = ({ style = {}, onStyleChange, component }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(style.scale || 1);
  const [position, setPosition] = useState({
    x: parseInt((style.objectPosition?.split(' ')[0] || '50%').replace('%', '')) || 50,
    y: parseInt((style.objectPosition?.split(' ')[1] || '50%').replace('%', '')) || 50
  });
  const [objectFit, setObjectFit] = useState(style.objectFit || 'cover');
  const [showSvgInput, setShowSvgInput] = useState(false);
  const [svgInput, setSvgInput] = useState('');

  const handleScaleChange = useCallback((newScale) => {
    const scale = Math.max(0.1, Math.min(3, newScale));
    setScale(scale);
    onStyleChange({
      scale: scale
    });
  }, [onStyleChange]);

  const handlePositionChange = useCallback((x, y) => {
    const newPosition = {
      x: typeof x === 'number' ? x : position.x,
      y: typeof y === 'number' ? y : position.y
    };
    setPosition(newPosition);
    
    const currentScale = style.scale || 1;
    if (currentScale > 1 || style.objectFit === 'cover') {
      onStyleChange({
        objectPosition: `${newPosition.x}% ${newPosition.y}%`
      });
    }
  }, [onStyleChange, position, style.scale]);

  const handleObjectFitChange = useCallback((fit) => {
    setObjectFit(fit);
    onStyleChange({
      objectFit: fit
    });
  }, [onStyleChange]);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (!component?.id) {
      setError('Component ID is missing');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target.result;
      
      dispatch(updateComponent({
        id: component.id,
        updates: { 
          content: imageData,
          props: {
            ...component.props,
            originalFileName: file.name
          }
        }
      }));

      onStyleChange({
        content: imageData,
        props: {
          ...component.props,
          originalFileName: file.name
        }
      });

      setIsLoading(false);
    };

    reader.onerror = () => {
      setError('Failed to read image file');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }, [component, dispatch]);

  const handleSvgSubmit = useCallback(() => {
    console.log('handleSvgSubmit called with:', {
      svgInput,
      componentProps: component.props,
      componentStyle: component.style
    });

    if (!svgInput.trim().includes('<svg')) {
      setError('Invalid SVG format');
      return;
    }

    const cleanSvg = svgInput.replace(/<!--[\s\S]*?-->/g, '');
    console.log('Cleaned SVG:', cleanSvg);

    dispatch(updateComponent({
      id: component.id,
      updates: {
        content: cleanSvg,
        props: {
          ...component.props,
          isSvg: true
        },
        style: {
          ...component.style,
          width: '100px',
          height: '100px',
          scale: 1
        }
      }
    }));

    onStyleChange({
      content: cleanSvg,
      props: {
        ...component.props,
        isSvg: true
      },
      style: {
        ...component.style,
        width: '100px',
        height: '100px',
        scale: 1
      }
    });

    setSvgInput('');
    setShowSvgInput(false);
  }, [svgInput, component, dispatch, onStyleChange]);

  const isSvg = component.props?.isSvg || (component.content && component.content.includes('<svg'));

  console.log('SVG Detection:', {
    isSvg,
    componentProps: component.props,
    content: component.content,
    hasSvgTag: component.content?.includes('<svg')
  });

  if (isSvg) {
    console.log('Switching to SVG Controls');
    return <SvgControls style={style} onStyleChange={onStyleChange} component={component} />;
  }

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Image Controls</h3>
      
      {/* Upload Buttons Group */}
      <div className="mb-4 space-y-2">
        {/* Image Upload Button */}
        <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors duration-200">
          <FaUpload className="mr-2" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* SVG Paste Button */}
        <button
          onClick={() => setShowSvgInput(!showSvgInput)}
          className="flex items-center justify-center w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200 hover:bg-purple-100 cursor-pointer transition-colors duration-200"
        >
          <FaCode className="mr-2" />
          <span>Paste SVG</span>
        </button>

        {/* SVG Input Field */}
        {showSvgInput && (
          <div className="mt-2 space-y-2">
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder="Paste SVG code here..."
              className="w-full h-32 p-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSvgSubmit}
                className="flex-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Apply SVG
              </button>
              <button
                onClick={() => {
                  setShowSvgInput(false);
                  setSvgInput('');
                }}
                className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {isLoading && <p className="text-blue-500 text-sm mt-1">Loading...</p>}
      </div>

      {/* Zoom Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Zoom</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScaleChange(scale - 0.1)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <FaSearchMinus />
          </button>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="flex-grow"
          />
          <button
            onClick={() => handleScaleChange(scale + 0.1)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <FaSearchPlus />
          </button>
        </div>
      </div>

      {/* Position Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Position</span>
        {objectFit !== 'cover' && scale <= 1 && (
          <p className="text-sm text-gray-500 mb-2">
            Position controls are available when zoomed in or using 'Cover' fit mode
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">X Position</label>
            <input
              type="range"
              min="0"
              max="100"
              value={position.x}
              onChange={(e) => handlePositionChange(parseInt(e.target.value), null)}
              className="w-full"
              disabled={objectFit !== 'cover' && scale <= 1}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Y Position</label>
            <input
              type="range"
              min="0"
              max="100"
              value={position.y}
              onChange={(e) => handlePositionChange(null, parseInt(e.target.value))}
              className="w-full"
              disabled={objectFit !== 'cover' && scale <= 1}
            />
          </div>
        </div>
      </div>

      {/* Object Fit Controls */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 block">Fit Mode</span>
        <div className="grid grid-cols-2 gap-2">
          {['cover', 'contain', 'fill', 'none'].map((fit) => (
            <button
              key={fit}
              onClick={() => handleObjectFitChange(fit)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 border ${
                objectFit === fit
                  ? 'bg-[#cce7ff] text-blue-700 border-blue-300'
                  : 'bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]'
              }`}
            >
              {fit.charAt(0).toUpperCase() + fit.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageControls;
