import React, { useRef } from "react";

const ImageControls = ({ component, updateComponent }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateComponent({ ...component, props: { ...component.props, [name]: value } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateComponent({ ...component, content: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleAspectRatioChange = (e) => {
    const keepAspectRatio = e.target.checked;
    updateComponent({ 
      ...component, 
      props: { 
        ...component.props, 
        keepAspectRatio 
      } 
    });
  };

  return (
    <div className="image-controls">
      <h3>Image Controls</h3>
      <div>
        <button onClick={handleUploadClick} className="upload-button">Upload Image</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      <div>
        <label htmlFor="alt">Alt Text:</label>
        <input
          type="text"
          id="alt"
          name="alt"
          value={component.props.alt || ""}
          onChange={handleChange}
          placeholder="Enter alt text"
        />
      </div>
      <div>
        <label htmlFor="shape">Shape:</label>
        <select
          id="shape"
          name="shape"
          value={component.props.shape || "rectangle"}
          onChange={handleChange}
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
        </select>
      </div>
      <div className="aspect-ratio-control">
        <label>
          <input
            type="checkbox"
            name="keepAspectRatio"
            checked={component.props.keepAspectRatio || false}
            onChange={handleAspectRatioChange}
          />
          Maintain Aspect Ratio
        </label>
      </div>
      <div>
        <label htmlFor="objectFit">Object Fit:</label>
        <select
          id="objectFit"
          name="objectFit"
          value={component.props.objectFit || "contain"}
          onChange={handleChange}
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>
      <div className="border-radius-control">
        <label htmlFor="borderRadius">Border Radius:</label>
        <div className="border-radius-inputs">
          <input
            type="number"
            id="borderRadius"
            name="borderRadius"
            value={parseInt(component.props.borderRadius) || 0}
            onChange={handleChange}
            min="0"
          />
          <select
            name="borderRadiusUnit"
            value={component.props.borderRadiusUnit || "px"}
            onChange={handleChange}
          >
            <option value="px">px</option>
            <option value="%">%</option>
          </select>
        </div>
      </div>
      <div className="box-shadow-control">
        <label>Box Shadow:</label>
        <div className="box-shadow-inputs">
          <div className="box-shadow-input">
            <label htmlFor="boxShadowX">X Offset</label>
            <input
              type="number"
              id="boxShadowX"
              name="boxShadowX"
              value={component.props.boxShadowX || 0}
              onChange={handleChange}
            />
          </div>
          <div className="box-shadow-input">
            <label htmlFor="boxShadowY">Y Offset</label>
            <input
              type="number"
              id="boxShadowY"
              name="boxShadowY"
              value={component.props.boxShadowY || 0}
              onChange={handleChange}
            />
          </div>
          <div className="box-shadow-input">
            <label htmlFor="boxShadowBlur">Blur</label>
            <input
              type="number"
              id="boxShadowBlur"
              name="boxShadowBlur"
              value={component.props.boxShadowBlur || 0}
              onChange={handleChange}
            />
          </div>
          <div className="box-shadow-input">
            <label htmlFor="boxShadowColor">Color</label>
            <input
              type="color"
              id="boxShadowColor"
              name="boxShadowColor"
              value={component.props.boxShadowColor || "#000000"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageControls;