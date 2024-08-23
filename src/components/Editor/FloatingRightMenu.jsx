import React from 'react';
import { FaTree, FaPalette, FaCog, FaDatabase, FaArrowsAlt, FaEye, FaChevronLeft } from 'react-icons/fa';

const FloatingRightMenu = ({
  onShowComponentTree,
  onShowComponentPalette,
  onShowGlobalSettings,
  onOpenDataModal,
  onToggleDragMode,
  onToggleSpacingVisibility,
  onToggleVisibility,
}) => {
  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '50px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 9998, // Lower than FloatingToolbar
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 0',
    }}>
      <button onClick={onShowComponentTree} style={buttonStyle}><FaTree /></button>
      <button onClick={onShowComponentPalette} style={buttonStyle}><FaPalette /></button>
      <button onClick={onShowGlobalSettings} style={buttonStyle}><FaCog /></button>
      <button onClick={onOpenDataModal} style={buttonStyle}><FaDatabase /></button>
      <button onClick={onToggleDragMode} style={buttonStyle}><FaArrowsAlt /></button>
      <button onClick={onToggleSpacingVisibility} style={buttonStyle}><FaEye /></button>
      <button onClick={onToggleVisibility} style={buttonStyle}><FaChevronLeft /></button>
    </div>
  );
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  fontSize: '18px',
  color: '#333',
  marginBottom: '10px',
};

export default FloatingRightMenu;