import React from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaCopy, FaPaste } from 'react-icons/fa';

const Toolbar = ({ onAlign, onDistribute, onCopy, onPaste }) => {
  return (
    <div className="bg-gray-800 text-white p-2 flex space-x-2">
      <button onClick={() => onAlign('left')} className="p-2 hover:bg-gray-700 rounded">
        <FaAlignLeft />
      </button>
      <button onClick={() => onAlign('center')} className="p-2 hover:bg-gray-700 rounded">
        <FaAlignCenter />
      </button>
      <button onClick={() => onAlign('right')} className="p-2 hover:bg-gray-700 rounded">
        <FaAlignRight />
      </button>
      <button onClick={() => onDistribute('horizontal')} className="p-2 hover:bg-gray-700 rounded">
        <FaAlignJustify />
      </button>
      <div className="border-l border-gray-600 mx-2"></div>
      <button onClick={onCopy} className="p-2 hover:bg-gray-700 rounded">
        <FaCopy />
      </button>
      <button onClick={onPaste} className="p-2 hover:bg-gray-700 rounded">
        <FaPaste />
      </button>
    </div>
  );
};

export default Toolbar;