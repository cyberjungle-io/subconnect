import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import EditorContext from "./EditorContext";
import ErrorBoundary from "./ErrorBoundary";
import MainRow from "./MainRow";
import useEditor from "./useEditor";

const Editor = () => {
  const [mainRows, setMainRows] = useState([{ id: Date.now(), columns: [] }]);
  const editorState = useEditor(mainRows);

  const addMainRow = () => {
    setMainRows((prev) => [...prev, { id: Date.now(), columns: [] }]);
  };

  const deleteMainRow = (index) => {
    setMainRows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ErrorBoundary>
      <EditorContext.Provider value={editorState}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Editor</h1>

          {mainRows.map((mainRow, rowIndex) => (
            <MainRow
              key={mainRow.id}
              mainRow={mainRow}
              rowIndex={rowIndex}
              onDeleteMainRow={deleteMainRow}
            />
          ))}

          <button
            onClick={addMainRow}
            className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            <PlusCircle className="mr-2" size={24} />
            <span>Add Main Row</span>
          </button>
        </div>
      </EditorContext.Provider>
    </ErrorBoundary>
  );
};

export default Editor;
