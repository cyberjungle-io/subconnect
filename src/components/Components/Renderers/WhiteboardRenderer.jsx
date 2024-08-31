import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaPen, FaEraser, FaTrash, FaSquare, FaCircle, FaMinus, FaLongArrowAltRight, FaFont, FaUndo, FaEye, FaTrashAlt, FaChevronDown, FaEyeSlash, FaRedo, FaSave, FaUpload, FaPlus, FaLayerGroup, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updateComponent, undoWhiteboard, redoWhiteboard } from '../../../features/editorSlice';
import TextareaAutosize from 'react-textarea-autosize';

const WhiteboardRenderer = ({ component, globalSettings }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pen');
  const [activeTool, setActiveTool] = useState('pen');
  const [startPoint, setStartPoint] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [strokeColor, setStrokeColor] = useState(component.props.strokeColor || globalSettings.generalComponentStyle.color || '#000000');
  const [strokeWidth, setStrokeWidth] = useState(component.props.strokeWidth || 2);
  const [showGrid, setShowGrid] = useState(component.props.showGrid || false);
  const dispatch = useDispatch();
  const whiteboardState = useSelector(state => state.editor.whiteboardState);
  const [selectedShape, setSelectedShape] = useState(null);
  const [layers, setLayers] = useState([{ id: 1, name: 'Layer 1', visible: true }]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [layersDropdownOpen, setLayersDropdownOpen] = useState(false);
  const [activeShape, setActiveShape] = useState('arrow');
  const [shapesDropdownOpen, setShapesDropdownOpen] = useState(false);
  const [eraserSize, setEraserSize] = useState(10);
  const [eraserDropdownOpen, setEraserDropdownOpen] = useState(false);
  const eraserDropdownRef = useRef(null);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const newImageData = canvas.toDataURL();
    dispatch(updateComponent({ id: component.id, updates: { props: { imageData: newImageData } } }));
  }, [dispatch, component.id]);

  const undo = useCallback(() => {
    dispatch(undoWhiteboard());
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch(redoWhiteboard());
  }, [dispatch]);

  const drawShape = useCallback((start, end) => {
    if (!context) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;

    switch (tool) {
      case 'rectangle':
        context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        break;
      case 'arrow':
        drawArrow(start, end);
        break;
      default:
        break;
    }

    context.stroke();
  }, [context, tool, strokeColor, strokeWidth]);

  const draw = useCallback((e) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
      context.fill();
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    }
  }, [isDrawing, context, tool, eraserSize]);

  const startDrawing = useCallback((e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
      context.fill();
    } else {
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.moveTo(x, y);
    }
  }, [context, tool, eraserSize]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    context.beginPath();
    context.globalCompositeOperation = 'source-over';
    saveToHistory();
  }, [context, saveToHistory]);

  const drawArrow = (start, end) => {
    const headlen = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(end.x, end.y);
    context.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
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
    if (component.isDraggingDisabled && tool === 'text') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextPosition({ x, y });
      setIsAddingText(true);
    }
  }, [component.isDraggingDisabled, tool]);

  const confirmText = useCallback(() => {
    if (textInput && textPosition) {
      context.font = `${component.props.fontSize || globalSettings.generalComponentStyle.fontSize || '16px'} ${component.props.fontFamily || globalSettings.generalComponentStyle.fontFamily || 'Arial'}`;
      context.fillStyle = component.props.textColor || globalSettings.generalComponentStyle.color || '#000000';
      context.fillText(textInput, textPosition.x, textPosition.y);
      setIsAddingText(false);
      setTextInput('');
      setTextPosition(null);
      saveToHistory();
    }
  }, [textInput, textPosition, context, component.props, globalSettings, saveToHistory]);

  const handleColorChange = (e) => {
    setStrokeColor(e.target.value);
  };

  const handleWidthChange = (e) => {
    setStrokeWidth(parseInt(e.target.value, 10));
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataURL;
    link.click();
  };

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

  const addLayer = () => {
    const newLayer = { id: layers.length + 1, name: `Layer ${layers.length + 1}`, visible: true };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
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

  const Minimap = () => {
    const minimapRef = useRef(null);

    useEffect(() => {
      const minimap = minimapRef.current;
      const ctx = minimap.getContext('2d');
      ctx.drawImage(canvasRef.current, 0, 0, minimap.width, minimap.height);
    }, [whiteboardState.history]);

    return <canvas ref={minimapRef} width={100} height={100} />;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    ctx.strokeStyle = component.props.strokeColor || globalSettings.generalComponentStyle.color || '#000000';
    ctx.lineWidth = component.props.strokeWidth || 2;

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
      
      ctx.strokeStyle = component.props.strokeColor || globalSettings.generalComponentStyle.color || '#000000';
      ctx.lineWidth = component.props.strokeWidth || 2;
    };

    resizeCanvas(); // Initial resize
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [component.props.strokeColor, component.props.strokeWidth, globalSettings]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (showGrid) {
      drawGrid(ctx);
    }
  }, [component.props, globalSettings, showGrid]);

  const drawGrid = (ctx) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvasRef.current.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasRef.current.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasRef.current.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasRef.current.width, y);
      ctx.stroke();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadCanvas(e);
      insertImage(file);
    }
  };

  const toggleLayersDropdown = () => setLayersDropdownOpen(prevState => !prevState);

  const toggleLayerVisibility = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const deleteLayer = (layerId) => {
    if (layers.length > 1) {
      setLayers(layers.filter(layer => layer.id !== layerId));
      if (activeLayer === layerId) {
        setActiveLayer(layers[0].id);
      }
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

  const toggleEraserDropdown = () => {
    setEraserDropdownOpen(!eraserDropdownOpen);
  };

  const EraserSizePreview = ({ size }) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        marginRight: '10px',
      }}
    />
  );

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

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: component.props.borderRadius || '4px', overflow: 'hidden', position: 'relative' }}>
      <div className="whiteboard-toolbar">
        <button
          onClick={() => handleToolChange('pen')}
          className={`toolbar-button ${activeTool === 'pen' ? 'active' : ''}`}
        >
          <FaPen />
        </button>
        <div className="dropdown shapes-dropdown">
          <button onClick={toggleShapesDropdown} className="toolbar-button">
            {React.createElement(getShapeIcon(activeShape))}
            <FaChevronDown />
          </button>
          {shapesDropdownOpen && (
            <div className="dropdown-menu">
              {shapes.map(shape => (
                <button
                  key={shape.value}
                  onClick={() => {
                    setActiveShape(shape.value);
                    handleToolChange(shape.value);
                    toggleShapesDropdown();
                  }}
                  className={`toolbar-button ${activeShape === shape.value ? 'active' : ''}`}
                >
                  <shape.icon /> {shape.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="eraser-tool" ref={eraserDropdownRef}>
          <button 
            className={`toolbar-button ${tool === 'eraser' ? 'active' : ''}`} 
            onClick={() => handleToolChange('eraser')}
          >
            <FaEraser />
          </button>
          <button 
            className="eraser-dropdown-toggle" 
            onClick={toggleEraserDropdown}
          >
            {eraserDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {eraserDropdownOpen && (
            <div className="eraser-dropdown">
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                <EraserSizePreview size={eraserSize} />
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(parseInt(e.target.value, 10))}
                  orient="vertical"
                  style={{ height: '100px' }}
                />
              </div>
            </div>
          )}
        </div>
        <button className="toolbar-button">
          <FaFont />
        </button>
        <button className="toolbar-button" onClick={undo} disabled={whiteboardState.historyIndex <= 0}>
          <FaUndo />
        </button>
        <button className="toolbar-button" onClick={redo} disabled={whiteboardState.historyIndex >= whiteboardState.history.length - 1}>
          <FaRedo />
        </button>
        <button className="toolbar-button">
          <FaSave />
        </button>
        <label className="toolbar-button">
          <FaUpload />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>
        <div className="dropdown layers-dropdown">
          <button onClick={toggleLayersDropdown} className="toolbar-button">
            <FaLayerGroup />
            <FaChevronRight />
          </button>
          {layersDropdownOpen && (
            <div className="dropdown-menu">
              {layers.map(layer => (
                <div key={layer.id} className="layer-item">
                  <span 
                    onClick={() => setActiveLayer(layer.id)}
                    style={{ fontWeight: activeLayer === layer.id ? 'bold' : 'normal' }}
                  >
                    {layer.name}
                  </span>
                  <button onClick={() => toggleLayerVisibility(layer.id)}>
                    {layer.visible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button onClick={() => deleteLayer(layer.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
              <button onClick={addLayer}>Add New Layer</button>
            </div>
          )}
        </div>
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
              font: `${component.props.fontSize || globalSettings.generalComponentStyle.fontSize || '16px'} ${component.props.fontFamily || globalSettings.generalComponentStyle.fontFamily || 'Arial'}`,
              color: component.props.textColor || globalSettings.generalComponentStyle.color || '#000000',
            }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #000',
          backgroundColor: component.props.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#ffffff',
          cursor: 'crosshair',
          borderRadius: 'inherit',
        }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onClick={addText}
      />
      <Minimap />
    </div>
  );
};

export default React.memo(WhiteboardRenderer);