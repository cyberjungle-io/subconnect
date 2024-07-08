import React from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

const PreviewModal = ({ onClose }) => {
  const typography = useSelector(state => state.editor.pageSettings.typography);

  const renderPreview = () => (
    <div className="p-6 bg-white rounded-lg shadow-md" style={typography}>
      <h1 style={typography.h1}>Heading 1</h1>
      <h2 style={typography.h2}>Heading 2</h2>
      <h3 style={typography.h3}>Heading 3</h3>
      <h4 style={typography.h4}>Heading 4</h4>
      <h5 style={typography.h5}>Heading 5</h5>
      <h6 style={typography.h6}>Heading 6</h6>
      <p style={typography.p}>
        This is a paragraph of text. It demonstrates the font family, size, and line height settings.
        You can see how the text wraps and flows within the preview container.
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Typography Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;