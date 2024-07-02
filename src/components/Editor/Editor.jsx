import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlusCircle } from 'react-icons/fa';
import MainRow from './MainRow';
import ErrorBoundary from '../common/ErrorBoundary';
import { addColumn, addMainRow } from '../../features/editorSlice';

const Editor = () => {
  const mainRows = useSelector(state => state.editor.mainRows);
  const dispatch = useDispatch();

  console.log('Editor render, mainRows:', mainRows); // Debugging

  const handleAddMainRow = () => {
    dispatch(addMainRow()); // Use the new addMainRow action
  };

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Editor</h1>
        
        {mainRows.map((mainRow, rowIndex) => (
          <MainRow 
            key={mainRow.id} 
            rowId={mainRow.id}
            rowIndex={rowIndex}
          />
        ))}
        
        <button 
          onClick={handleAddMainRow}
          className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
        >
          <FaPlusCircle className="mr-2" size={24} />
          <span>Add Main Row</span>
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default Editor;