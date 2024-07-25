import React from 'react';
import { FaColumns, FaFont, FaChartBar, FaTable, FaImage, FaPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addComponent } from '../features/editorSlice';

const WireframeMenu = () => {
  const dispatch = useDispatch();

  const handleAddComponent = (type) => {
    dispatch(addComponent({ type }));
  };

  const menuItems = [
    { type: 'FLEX_CONTAINER', icon: FaColumns, label: 'Flex Container' },
    { type: 'text', icon: FaFont, label: 'Text' },
    { type: 'heading', icon: FaFont, label: 'Heading' },
    { type: 'chart', icon: FaChartBar, label: 'Chart' },
    { type: 'table', icon: FaTable, label: 'Table' },
    { type: 'image', icon: FaImage, label: 'Image' },
    { type: 'video', icon: FaPlayCircle, label: 'Video' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Add Components</h2>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.type}
            onClick={() => handleAddComponent(item.type)}
            className="flex items-center w-full p-2 bg-white hover:bg-gray-200 rounded"
          >
            <item.icon className="mr-2" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WireframeMenu;