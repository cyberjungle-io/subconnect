import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaPen, FaEraser, FaTrash, FaSquare, FaCircle, FaMinus, FaLongArrowAltRight, FaFont, FaUndo, FaEye, FaTrashAlt, FaChevronDown, FaEyeSlash, FaRedo, FaSave, FaUpload, FaPlus, FaLayerGroup, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updateComponent, undoWhiteboard, redoWhiteboard } from '../../../features/editorSlice';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash/debounce';
import ColorPicker from '../../common/ColorPicker'; // Import the ColorPicker component

const WhiteboardRenderer = ({ component, globalSettings, isViewMode }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pen');
  const [activeTool, setActiveTool] = useState('pen');
  const [startPoint, setStartPoint] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const dispatch = useDispatch();
  const whiteboardState = useSelector(state => state.editor.whiteboardState);
  const [selectedShape, setSelectedShape] = useState(null);
  const [activeShape, setActiveShape] = useState('arrow');
  const [shapesDropdownOpen, setShapesDropdownOpen] = useState(false);
  const [eraserSize, setEraserSize] = useState(10);
  const [eraserDropdownOpen, setEraserDropdownOpen] = useState(false);
  const eraserDropdownRef = useRef(null);
  const tempCanvasRef = useRef(null);
  const [tempContext, setTempContext] = useState(null);
  const [drawSize, setDrawSize] = useState(4);
  const [drawSizeDropdownOpen, setDrawSizeDropdownOpen] = useState(false);
  const drawSizeDropdownRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [lastPoint, setLastPoint] = useState(null);
  const [lastMidPoint, setLastMidPoint] = useState(null);
  const [textStyle, setTextStyle] = useState({
    fontSize: component.props.fontSize || globalSettings.generalComponentStyle.fontSize || '16px',
    fontFamily: component.props.fontFamily || globalSettings.generalComponentStyle.fontFamily || 'Arial',
    color: component.props.textColor || globalSettings.generalComponentStyle.color || '#000000',
  });
  const shapesDropdownRef = useRef(null);
  const [previewPosition, setPreviewPosition] = useState('right');
  const [color, setColor] = useState('#000000'); // Add state for color
  const [showColorPicker, setShowColorPicker] = useState(false); // Add state for showing color picker
  const colorPickerRef = useRef(null); // Ref for the color picker

  const getEventCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;

    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  }, []);

  const updateCursorPosition = useCallback((e) => {
    const { x, y } = getEventCoordinates(e);
    setCursorPosition({ x, y });
  }, [getEventCoordinates]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const newImageData = canvas.toDataURL();
    dispatch(updateComponent({ id: component.id, updates: { props: { imageData: newImageData } } }));
    
    // Auto-save logic
    // You might want to debounce this function to prevent too frequent saves
    autoSave(newImageData);
  }, [dispatch, component.id]);

  const autoSave = useCallback(debounce((imageData) => {
    // Implement your auto-save logic here
    // For example, you could send the imageData to your backend API
    console.log('Auto-saving whiteboard...');
    // api.saveWhiteboard(component.id, imageData);
  }, 2000), []);  // Debounce for 2 seconds

  const undo = useCallback(() => {
    dispatch(undoWhiteboard());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoWhiteboard());
  }, [dispatch]);

  const drawShape = useCallback((start, end, ctx) => {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.beginPath();
    ctx.strokeStyle = whiteboardState.strokeColor;
    ctx.lineWidth = 2; // Set a fixed line width of 2

    switch (activeShape) {
      case 'square':
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        break;
      case 'arrow':
        drawArrow(ctx, start, end);
        break;
      default:
        break;
    }

    ctx.stroke();
  }, [activeShape, whiteboardState.strokeColor]);

  const startDrawing = useCallback((e) => {
    if (!isViewMode) return;

    setDrawSizeDropdownOpen(false);
    setIsDrawing(true);
    const { x, y } = getEventCoordinates(e);

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
      context.fill();
    } else if (tool !== 'pen') {
      setStartPoint({ x, y });
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = drawSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      setLastPoint({ x, y });
    }
    updateCursorPosition(e);
  }, [context, tool, eraserSize, drawSize, updateCursorPosition, getEventCoordinates, isViewMode]);

  const draw = useCallback((e) => {
    if (!isViewMode) return;

    updateCursorPosition(e);
    if (!isDrawing) return;

    const { x, y } = getEventCoordinates(e);

    if (tool === 'pen') {
      if (lastPoint) {
        context.beginPath();
        
        if (lastMidPoint) {
          context.moveTo(lastMidPoint.x, lastMidPoint.y);
        } else {
          context.moveTo(lastPoint.x, lastPoint.y);
        }

        const midPoint = midPointBtw(lastPoint.x, lastPoint.y, x, y);
        
        // Interpolate points
        const pointsToFill = getPointsOnLine(lastPoint.x, lastPoint.y, x, y);
        pointsToFill.forEach((point, index) => {
          const midPointToFill = midPointBtw(lastPoint.x, lastPoint.y, point.x, point.y);
          context.quadraticCurveTo(lastPoint.x, lastPoint.y, midPointToFill.x, midPointToFill.y);
        });

        context.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
        
        context.stroke();
        setLastPoint({ x, y });
        setLastMidPoint(midPoint);
      }
    } else if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
      context.fill();
    } else if (startPoint) {
      drawShape(startPoint, { x, y }, tempContext);
    }
  }, [isDrawing, context, tool, eraserSize, startPoint, drawShape, tempContext, updateCursorPosition, lastPoint, lastMidPoint, getEventCoordinates, isViewMode]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      if (tool !== 'pen' && tool !== 'eraser') {
        context.drawImage(tempCanvasRef.current, 0, 0);
        tempContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setIsDrawing(false);
      setStartPoint(null);
      context.beginPath();
      context.globalCompositeOperation = 'source-over';
      setLastPoint(null);
      setLastMidPoint(null);
      saveToHistory();
    }
  }, [isDrawing, context, tool, tempContext, saveToHistory]);

  const drawArrow = (ctx, start, end) => {
    const headlen = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, [saveToHistory]);

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setActiveTool(newTool);
    if (newTool !== 'eraser') {
      setActiveShape(newTool);
    }
  };

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
  };

  const addText = useCallback((e) => {
    if (tool === 'text') {
      const { x, y } = getEventCoordinates(e);
      setTextPosition({ x, y });
      setIsAddingText(true);
    }
  }, [tool, getEventCoordinates]);

  const confirmText = useCallback(() => {
    if (textInput && textPosition) {
      context.font = `${textStyle.fontSize} ${textStyle.fontFamily}`;
      context.fillStyle = textStyle.color;
      context.fillText(textInput, textPosition.x, textPosition.y);
      setIsAddingText(false);
      setTextInput('');
      setTextPosition(null);
      saveToHistory();
    }
  }, [textInput, textPosition, context, textStyle, saveToHistory]);

  const loadCanvas = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveToHistory();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const selectShape = (shape) => {
    setSelectedShape(shape);
  };

  const moveShape = (dx, dy) => {
    if (selectedShape) {
      // Update shape position
    }
  };

  const insertImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    ctx.strokeStyle = whiteboardState.strokeColor;
    ctx.lineWidth = 2; // Set a fixed line width of 2

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCanvasRef.current = tempCanvas;
    setTempContext(tempCanvas.getContext('2d'));

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      
      // Create a temporary canvas to store the current drawing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0);

      // Resize the main canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Redraw the content
      ctx.drawImage(tempCanvas, 0, 0);
      
      ctx.strokeStyle = whiteboardState.strokeColor;
      ctx.lineWidth = 2; // Set a fixed line width of 2
    };

    resizeCanvas(); // Initial resize
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [whiteboardState.strokeColor]);

  useEffect(() => {
    if (component.props.imageData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = component.props.imageData;
    }
  }, [component.props.imageData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadCanvas(e);
      insertImage(file);
    }
  };

  const toggleShapesDropdown = () => setShapesDropdownOpen(prevState => !prevState);

  const shapes = [
    { name: 'Arrow', icon: FaLongArrowAltRight, value: 'arrow' },
    { name: 'Square', icon: FaSquare, value: 'square' },
    { name: 'Circle', icon: FaCircle, value: 'circle' },
    { name: 'Line', icon: FaMinus, value: 'line' },
  ];

  const getShapeIcon = (value) => {
    const shape = shapes.find(s => s.value === value);
    return shape ? shape.icon : FaLongArrowAltRight;
  };

  const toggleDrawSizeDropdown = () => {
    setDrawSizeDropdownOpen((prevState) => !prevState);
    setEraserDropdownOpen(false); // Close eraser dropdown when opening pen dropdown
  };

  const toggleEraserDropdown = () => {
    setEraserDropdownOpen((prevState) => !prevState);
    setDrawSizeDropdownOpen(false); // Close pen dropdown when opening eraser dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eraserDropdownRef.current && !eraserDropdownRef.current.contains(event.target)) {
        setEraserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDrawSizeChange = (e) => {
    setDrawSize(parseInt(e.target.value, 10));
    handleToolChange('pen'); // Switch to pen tool when the pen size slider is moved
  };

  const handleEraserSizeChange = (e) => {
    setEraserSize(parseInt(e.target.value, 10));
    handleToolChange('eraser'); // Switch to eraser tool when the eraser size slider is moved
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawSizeDropdownRef.current && !drawSizeDropdownRef.current.contains(event.target)) {
        setDrawSizeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cursorSize = tool === 'eraser' ? eraserSize : drawSize;

  // Add this helper function for calculating midpoints
  const midPointBtw = (p1x, p1y, p2x, p2y) => {
    return {
      x: p1x + (p2x - p1x) / 2,
      y: p1y + (p2y - p1y) / 2
    };
  };

  // Helper function to get points on a line
  const getPointsOnLine = (x1, y1, x2, y2) => {
    const points = [];
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.ceil(distance / 5); // Adjust this value to control smoothness

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t
      });
    }

    return points;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shapesDropdownRef.current && !shapesDropdownRef.current.contains(event.target)) {
        setShapesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnterSlider = (e) => {
    const sliderRect = e.target.getBoundingClientRect();
    const mouseX = e.clientX;
    const sliderCenterX = sliderRect.left + sliderRect.width / 2;

    if (mouseX < sliderCenterX) {
      setPreviewPosition('right');
    } else {
      setPreviewPosition('left');
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded overflow-hidden relative">
      <div className="whiteboard-toolbar flex flex-row items-center absolute top-2.5 left-2.5 z-10 bg-transparent p-1 rounded">
        {/* Pen tool */}
        <div className="relative inline-flex items-center rounded overflow-visible mr-3" ref={drawSizeDropdownRef}>
          <button
            onClick={() => handleToolChange('pen')}
            className={`toolbar-button ${activeTool === 'pen' ? 'active' : ''} border-none p-2 m-0 cursor-pointer rounded-l transition-colors flex items-center justify-center`}
          >
            <FaPen />
          </button>
          <button
            onClick={toggleDrawSizeDropdown}
            className="draw-size-dropdown-toggle p-2 border-none cursor-pointer flex items-center rounded-r"
          >
            <FaChevronDown />
          </button>
          {drawSizeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg p-2">
              <input
                type="range"
                min="1"
                max="20"
                value={drawSize}
                onChange={handleDrawSizeChange}
                onMouseEnter={handleMouseEnterSlider}
                className="w-32"
              />
              <div className="pen-size-preview" style={{
                position: 'absolute',
                [previewPosition]: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${drawSize}px`,
                height: `${drawSize}px`,
                backgroundColor: 'black',
                borderRadius: '50%',
                marginLeft: previewPosition === 'left' ? '10px' : '',
                marginRight: previewPosition === 'right' ? '10px' : '',
              }} />
            </div>
          )}
        </div>

        {/* Shapes button */}
        <div className="relative inline-flex items-center rounded overflow-visible mr-3" ref={shapesDropdownRef}>
          <button
            onClick={() => handleToolChange(activeShape)}
            className={`toolbar-button ${activeTool === activeShape ? 'active' : ''} border-none p-2 m-0 cursor-pointer rounded-l transition-colors flex items-center justify-center`}
          >
            {React.createElement(getShapeIcon(activeShape))}
          </button>
          <button
            onClick={toggleShapesDropdown}
            className="shapes-dropdown-toggle p-2 border-none cursor-pointer flex items-center rounded-r"
          >
            <FaChevronDown />
          </button>
          {shapesDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg">
              {shapes.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => {
                    setActiveShape(shape.value);
                    handleToolChange(shape.value);
                    setShapesDropdownOpen(false);
                  }}
                  className="w-full flex items-center p-2 hover:bg-gray-100"
                >
                  {React.createElement(shape.icon)}
                  <span className="ml-2">{shape.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Eraser tool */}
        <div className="relative inline-flex items-center rounded overflow-visible mr-3" ref={eraserDropdownRef}>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`toolbar-button ${tool === 'eraser' ? 'active' : ''} border-none p-2 m-0 cursor-pointer rounded-l transition-colors flex items-center justify-center`}
          >
            <FaEraser />
          </button>
          <button
            onClick={toggleEraserDropdown}
            className="eraser-dropdown-toggle p-2 border-none cursor-pointer flex items-center rounded-r"
          >
            <FaChevronDown />
          </button>
          {eraserDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg p-2">
              <input
                type="range"
                min="5"
                max="50"
                value={eraserSize}
                onChange={handleEraserSizeChange}
                onMouseEnter={handleMouseEnterSlider}
                className="w-32"
              />
              <div className="eraser-size-preview" style={{
                position: 'absolute',
                [previewPosition]: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${eraserSize}px`,
                height: `${eraserSize}px`,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid black',
                borderRadius: '50%',
                marginLeft: previewPosition === 'left' ? '10px' : '',
                marginRight: previewPosition === 'right' ? '10px' : '',
              }} />
            </div>
          )}
        </div>

        {/* Text button (no chevron) */}
        <button 
          className={`toolbar-button ${tool === 'text' ? 'active' : ''} border-none p-2 m-0 cursor-pointer rounded transition-colors flex items-center justify-center mr-3`}
          onClick={() => handleToolChange('text')}
        >
          <FaFont />
        </button>

        {/* Color tool (no chevron) */}
        <button
          className="toolbar-button border-none p-2 m-0 cursor-pointer rounded transition-colors flex items-center justify-center mr-3"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <div style={{ width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%' }} />
        </button>

        {/* Remaining buttons without chevrons */}
        <button 
          className="toolbar-button border-none p-2 m-0 cursor-pointer rounded transition-colors flex items-center justify-center mr-3" 
          onClick={undo} 
          disabled={whiteboardState.historyIndex <= 0} 
        >
          <FaUndo />
        </button>

        <button 
          className="toolbar-button border-none p-2 m-0 cursor-pointer rounded transition-colors flex items-center justify-center mr-3" 
          onClick={redo} 
          disabled={whiteboardState.historyIndex >= whiteboardState.history.length - 1} 
        >
          <FaRedo />
        </button>

        <label className="toolbar-button border-none p-2 m-0 cursor-pointer rounded transition-colors flex items-center justify-center mr-3">
          <FaUpload />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>
      </div>
      {isAddingText && (
        <div
          style={{
            position: 'absolute',
            left: textPosition.x,
            top: textPosition.y,
            zIndex: 1000,
          }}
        >
          <TextareaAutosize
            value={textInput}
            onChange={handleTextInput}
            onBlur={confirmText}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              font: `${textStyle.fontSize} ${textStyle.fontFamily}`,
              color: textStyle.color,
              minWidth: '100px',
            }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: component.props.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#ffffff',
          cursor: isViewMode ? (tool === 'text' ? 'text' : 'none') : 'default',
          // Border styles
          borderWidth: component.style?.borderWidth || '0px',
          borderStyle: component.style?.borderStyle || 'solid',
          borderColor: component.style?.borderColor || '#000000',
          borderRadius: component.style?.borderRadius || '0px',
          // Add shadow styles
          boxShadow: component.style?.boxShadow || 'none',
          touchAction: 'none',
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onClick={addText}
      />
      <canvas
        ref={tempCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          // Add shadow styles to match main canvas
          boxShadow: component.style?.boxShadow || 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x,
          top: cursorPosition.y,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          borderRadius: '50%',
          border: '1px solid black',
          backgroundColor: tool === 'eraser' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

export default React.memo(WhiteboardRenderer);
