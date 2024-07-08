import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlusCircle, FaEllipsisV } from 'react-icons/fa';
import MainRow from './MainRow';
import ErrorBoundary from '../common/ErrorBoundary';
import { addColumn, addMainRow } from '../../features/editorSlice';
import PageEditor from './PageEditor';
import Dropdown from '../common/Dropdown';


const Editor = () => {
  const mainRows = useSelector(state => state.editor.mainRows);
  const pageSettings = useSelector(state => state.editor.pageSettings);
  const dispatch = useDispatch();
  const [showPageEditor, setShowPageEditor] = useState(false);

  console.log('Editor render, mainRows:', mainRows); // Debugging

  const handleAddMainRow = () => {
    dispatch(addMainRow()); // Use the new addMainRow action
  };

  const dropdownItems = [
    {
      label: 'Page Settings',
      onClick: () => setShowPageEditor(!showPageEditor),
    },
    // Add more menu items here as needed
  ];

  // Create a style object for the main container
  const containerStyle = {
    backgroundColor: pageSettings.backgroundColor,
    fontFamily: pageSettings.typography.fontFamily,
    fontSize: pageSettings.typography.fontSize,
    lineHeight: pageSettings.typography.lineHeight,
  };

  // Create style objects for headings and paragraphs
  const textStyles = Object.entries(pageSettings.typography)
    .filter(([key]) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(key))
    .map(([tag, style]) => `
      ${tag} {
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        color: ${style.color};
      }
    `).join('\n');

  // Create scrollbar styles
  const scrollbarStyles = !pageSettings.scrollbar.useDefault
    ? `
      ::-webkit-scrollbar {
        width: ${pageSettings.scrollbar.width};
      }
      ::-webkit-scrollbar-track {
        background: ${pageSettings.scrollbar.trackColor};
      }
      ::-webkit-scrollbar-thumb {
        background: ${pageSettings.scrollbar.thumbColor};
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${pageSettings.scrollbar.thumbHoverColor};
      }
      * {
        scrollbar-width: thin;
        scrollbar-color: ${pageSettings.scrollbar.thumbColor} ${pageSettings.scrollbar.trackColor};
      }
    `
    : '';


    return (
      <ErrorBoundary>
         <div className="flex">
           <div 
            className={`flex-grow p-4 ${pageSettings.scrollDirection === 'horizontal' ? 'flex overflow-x-auto' : ''}`}
            style={containerStyle}
          >
            <style>
              {textStyles}
              {scrollbarStyles}
            </style>
  
            {/* Dropdown Menu */}
            <div className="absolute top-4 right-4 z-10">
              <Dropdown
                trigger={
                  <button className="p-2 rounded-full hover:bg-gray-200">
                    <FaEllipsisV />
                  </button>
                }
                items={dropdownItems}
              />
            </div>
  
            <h1 className="text-2xl font-bold mb-4">Editor</h1>
            
            <div className={pageSettings.scrollDirection === 'horizontal' ? 'flex' : ''}>
              {mainRows.map((mainRow, rowIndex) => (
                <MainRow 
                  key={mainRow.id} 
                  rowId={mainRow.id}
                  rowIndex={rowIndex}
                />
              ))}
            </div>
            
            <button 
              onClick={handleAddMainRow}
              className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors mt-4"
            >
              <FaPlusCircle className="mr-2" size={24} />
              <span>Add Main Row</span>
            </button>
          </div>
  
           {showPageEditor && (
            <div className="w-[350px] border-l border-gray-200">
              <PageEditor />
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  };
  

export default Editor;