import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCog, FaTable } from 'react-icons/fa';
import WireframeMenu from './WireframeMenu';
import DataMenu from './DataMenu';
import Editor from './Editor';
import { setEditorMode } from '../features/editorSlice';

const EditorWorkflow = () => {
  const dispatch = useDispatch();
  const editorMode = useSelector(state => state.editor.mode);

  const handleModeChange = (mode) => {
    dispatch(setEditorMode(mode));
  };

  return (
    <div className="flex h-screen">
      {/* Main Editor Area */}
      <div className="flex-grow">
        <Editor />
      </div>

      {/* Right Side Menu */}
      <div className="w-64 bg-gray-100 p-4">
        {/* Mode Toggle */}
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 ${editorMode === 'wireframe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleModeChange('wireframe')}
          >
            <FaCog className="inline-block mr-2" />
            Wireframe
          </button>
          <button
            className={`flex-1 py-2 px-4 ${editorMode === 'data' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleModeChange('data')}
          >
            <FaTable className="inline-block mr-2" />
            Data
          </button>
        </div>

        {/* Mode-specific Menu */}
        {editorMode === 'wireframe' ? <WireframeMenu /> : <DataMenu />}
      </div>
    </div>
  );
};

export default EditorWorkflow;