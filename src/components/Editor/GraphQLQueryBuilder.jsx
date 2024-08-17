import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const SchemaItem = ({ item, onSelect, selectedFields, depth = 0, path = [] }) => {
  // ... existing SchemaItem code ...
};

const GraphQLQueryBuilder = ({ localSchema, selectedFields, handleSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Schema Hierarchy</h3>
      <div className="border rounded p-2 h-64 overflow-y-auto">
        <ul>
          {localSchema.map(item => (
            <SchemaItem
              key={item.name}
              item={item}
              onSelect={handleSelect}
              selectedFields={selectedFields}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GraphQLQueryBuilder;