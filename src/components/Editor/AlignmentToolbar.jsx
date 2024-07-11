import React from 'react';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
         FaAlignTop, FaAlignMiddle, FaAlignBottom,
         FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';

const ToolbarButton = ({ icon: Icon, onClick, tooltip }) => (
  <button
    className="p-2 hover:bg-gray-200 rounded"
    onClick={onClick}
    title={tooltip}
  >
    <Icon />
  </button>
);

const AlignmentToolbar = ({ onAlign, onDistribute }) => (
  <div className="flex items-center space-x-2 bg-white p-2 border-b border-gray-200">
    <ToolbarButton icon={FaAlignLeft} onClick={() => onAlign('left')} tooltip="Align Left" />
    <ToolbarButton icon={FaAlignCenter} onClick={() => onAlign('center')} tooltip="Align Center" />
    <ToolbarButton icon={FaAlignRight} onClick={() => onAlign('right')} tooltip="Align Right" />
    <ToolbarButton icon={FaAlignJustify} onClick={() => onAlign('justify')} tooltip="Justify" />
    <div className="border-r border-gray-300 h-6 mx-2" />
    <ToolbarButton icon={FaAlignTop} onClick={() => onAlign('top')} tooltip="Align Top" />
    <ToolbarButton icon={FaAlignMiddle} onClick={() => onAlign('middle')} tooltip="Align Middle" />
    <ToolbarButton icon={FaAlignBottom} onClick={() => onAlign('bottom')} tooltip="Align Bottom" />
    <div className="border-r border-gray-300 h-6 mx-2" />
    <ToolbarButton icon={FaArrowsAltH} onClick={() => onDistribute('horizontal')} tooltip="Distribute Horizontally" />
    <ToolbarButton icon={FaArrowsAltV} onClick={() => onDistribute('vertical')} tooltip="Distribute Vertically" />
  </div>
);

export default AlignmentToolbar;