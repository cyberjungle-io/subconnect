import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaPen, FaEraser, FaTrash, FaSquare, FaCircle, FaMinus, FaLongArrowAltRight, FaFont, FaUndo, FaRedo, FaSave, FaUpload } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../../../features/editorSlice';

const WhiteboardRenderer = ({ component, globalSettings }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pen');
  const [startPoint, setStartPoint] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [strokeColor, setStrokeColor] = useState(component.props.strokeColor || globalSettings.generalComponentStyle.color || '#000000');
  const [strokeWidth, setStrokeWidth] = useState(component.props.strokeWidth || 2);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const dispatch = useDispatch();

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    dispatch(updateComponent({ id: component.id, updates: { props: { imageData } } }));
  }, [dispatch, component.id]);
  
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    saveCanvasState();
  }, [history, historyIndex, saveCanvasState]);

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
    if (component.isDraggingDisabled && isDrawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (tool === 'pen' || tool === 'eraser') {
        context.strokeStyle = tool === 'eraser' ? (component.props.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#ffffff') : strokeColor;
        context.lineWidth = tool === 'eraser' ? 20 : strokeWidth;
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
      } else if (['rectangle', 'circle', 'line', 'arrow'].includes(tool)) {
        drawShape(startPoint, { x, y });
      }
    }
  }, [component.isDraggingDisabled, isDrawing, tool, context, startPoint, strokeColor, strokeWidth, drawShape, component.props.backgroundColor, globalSettings]);

  const startDrawing = useCallback((e) => {
    if (component.isDraggingDisabled) {
      e.preventDefault();
      setIsDrawing(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPoint({ x, y });
      if (tool === 'pen' || tool === 'eraser') {
        draw(e);
      }
    }
  }, [component.isDraggingDisabled, tool, draw]);

  const stopDrawing = useCallback(() => {
    if (component.isDraggingDisabled) {
      setIsDrawing(false);
      context.beginPath();
      if (['rectangle', 'circle', 'line', 'arrow'].includes(tool)) {
        drawShape(startPoint, { x: startPoint.x, y: startPoint.y });
      }
      saveCanvasState();
    }
  }, [component.isDraggingDisabled, context, tool, drawShape, startPoint, saveCanvasState]);

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

  const confirmText = () => {
    if (textInput && textPosition) {
      context.font = `${component.props.fontSize || globalSettings.generalComponentStyle.fontSize || '16px'} ${component.props.fontFamily || globalSettings.generalComponentStyle.fontFamily || 'Arial'}`;
      context.fillStyle = component.props.textColor || globalSettings.generalComponentStyle.color || '#000000';
      context.fillText(textInput, textPosition.x, textPosition.y);
      setIsAddingText(false);
      setTextInput('');
      setTextPosition(null);
    }
  };

  const handleColorChange = (e) => {
    setStrokeColor(e.target.value);
  };

  const handleWidthChange = (e) => {
    setStrokeWidth(parseInt(e.target.value, 10));
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      loadFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      loadFromHistory(historyIndex + 1);
    }
  };

  const loadFromHistory = (index) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[index];
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    ctx.strokeStyle = component.props.strokeColor || globalSettings.generalComponentStyle.color || '#000000';
    ctx.lineWidth = component.props.strokeWidth || 2;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
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
    saveToHistory();
  }, [saveToHistory]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="whiteboard-toolbar">
        <button onClick={() => handleToolChange('pen')} className={tool === 'pen' ? 'active' : ''}>
          <FaPen />
        </button>
        <button onClick={() => handleToolChange('eraser')} className={tool === 'eraser' ? 'active' : ''}>
          <FaEraser />
        </button>
        <button onClick={() => handleToolChange('rectangle')} className={tool === 'rectangle' ? 'active' : ''}>
          <FaSquare />
        </button>
        <button onClick={() => handleToolChange('circle')} className={tool === 'circle' ? 'active' : ''}>
          <FaCircle />
        </button>
        <button onClick={() => handleToolChange('line')} className={tool === 'line' ? 'active' : ''}>
          <FaMinus />
        </button>
        <button onClick={() => handleToolChange('arrow')} className={tool === 'arrow' ? 'active' : ''}>
          <FaLongArrowAltRight />
        </button>
        <button onClick={() => handleToolChange('text')} className={tool === 'text' ? 'active' : ''}>
          <FaFont />
        </button>
        <input type="color" value={strokeColor} onChange={handleColorChange} />
        <input type="range" min="1" max="20" value={strokeWidth} onChange={handleWidthChange} />
        <button onClick={undo} disabled={historyIndex <= 0}>
          <FaUndo />
        </button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1}>
          <FaRedo />
        </button>
        <button onClick={clearCanvas}>
          <FaTrash />
        </button>
        <button onClick={saveCanvas}>
          <FaSave />
        </button>
        <label>
          <FaUpload />
          <input type="file" accept="image/*" onChange={loadCanvas} style={{ display: 'none' }} />
        </label>
      </div>
      {isAddingText && (
        <div
          style={{
            position: 'absolute',
            left: textPosition.x,
            top: textPosition.y,
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={handleTextInput}
            onBlur={confirmText}
            autoFocus
          />
        </div>
      )}
      <div style={{ flex: 1, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #000',
            backgroundColor: component.props.backgroundColor || globalSettings.generalComponentStyle.backgroundColor || '#ffffff',
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: component.isDraggingDisabled ? 'crosshair' : 'move',
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onClick={addText}
        />
      </div>
    </div>
  );
};

export default React.memo(WhiteboardRenderer);