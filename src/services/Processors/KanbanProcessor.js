export class KanbanProcessor {
  static kanbanPatterns = [
    /(?:add|create|make|new)\s+column/i,
    /(?:set|make|change|update)?\s*(?:the)?\s*column\s*(?:color|background|style|border)/i,
    /(?:add|create|make|new)\s+task/i,
    /(?:move|drag)\s+task/i,
  ];

  static isKanbanCommand(input) {
    return this.kanbanPatterns.some((pattern) =>
      pattern.test(input.toLowerCase())
    );
  }

  static getStylePatterns() {
    return {
      columnStyle: [
        // Column color changes
        /(?:set|make|change)?\s*(?:the)?\s*column\s*(?:color|background)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,
        /column\s*(?:color|background)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,

        // Column border styles
        /(?:set|make|change)?\s*(?:the)?\s*column\s*border\s*(?:style|width|color|radius)?\s*(?:to|=|:)?\s*(\d+px|\d+em|thin|medium|thick|#[0-9a-fA-F]{3,6})/i,

        // Column padding
        /(?:set|make|change)?\s*(?:the)?\s*column\s*padding\s*(?:to|=|:)?\s*(\d+px|\d+em|\d+rem)/i,
      ],
      taskStyle: [
        // Task card styles
        /(?:set|make|change)?\s*(?:the)?\s*task\s*(?:card)?\s*(?:style|background|color)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i,

        // Task border styles
        /(?:set|make|change)?\s*(?:the)?\s*task\s*(?:card)?\s*border\s*(?:style|width|color|radius)?\s*(?:to|=|:)?\s*(\d+px|\d+em|thin|medium|thick|#[0-9a-fA-F]{3,6})/i,
      ],
    };
  }

  static getPropertyNames() {
    return {
      columnStyle: "column style",
      taskStyle: "task card style",
    };
  }

  static updateNestedProps(currentProps, updates) {
    // Create a deep copy of the current props
    const newProps = { ...currentProps };

    // Update the top-level columns/tasks
    if (updates.columns) {
      newProps.columns = updates.columns;
    }
    if (updates.tasks) {
      newProps.tasks = updates.tasks;
    }

    // Update the nested props if they exist
    if (newProps.props) {
      newProps.props = {
        ...newProps.props,
        columns: updates.columns || newProps.props.columns,
        tasks: updates.tasks || newProps.props.tasks,
      };
    }

    return newProps;
  }

  static processCommand(input, currentProps = {}) {
    console.log(
      "KanbanProcessor received input:",
      input,
      "Current props:",
      currentProps
    );
    const lowercaseInput = input.toLowerCase();

    // Enhanced column creation pattern
    const columnPatterns = [
      /(?:add|create)\s+(?:a\s+)?(?:new\s+)?column\s+(?:called|named|with\s+title|titled)?\s*["']?([^"']+)["']?/i,
      /(?:add|create)\s+(?:a\s+)?(?:new\s+)?column\s*["']?([^"']+)["']?/i,
      /new\s+column\s+(?:called|named|with\s+title|titled)?\s*["']?([^"']+)["']?/i
    ];

    // Check each column pattern
    for (const pattern of columnPatterns) {
      const columnMatch = input.match(pattern);
      if (columnMatch) {
        const columnTitle = columnMatch[1].trim();
        
        // Validate column title
        if (!columnTitle || columnTitle.length < 1) {
          console.log("Invalid column title");
          return null;
        }

        // Check for duplicate column titles
        const currentColumns = currentProps.columns || currentProps.props?.columns || [];
        if (currentColumns.some(col => col.title.toLowerCase() === columnTitle.toLowerCase())) {
          console.log("Column with this title already exists");
          return null;
        }

        // Generate unique column ID using timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const columnId = `col_${timestamp}_${randomString}`;

        const newColumn = {
          id: columnId,
          title: columnTitle,
          backgroundColor: currentColumns[0]?.backgroundColor, // Inherit color from first column if exists
          tasks: []
        };

        const updatedColumns = [...currentColumns, newColumn];

        return {
          props: this.updateNestedProps(currentProps, {
            columns: updatedColumns
          })
        };
      }
    }

    // Handle column color changes
    const columnColorMatch = input.match(
      /(?:set|make|change)?\s*(?:the)?\s*column\s*(?:color|background)?\s*(?:to|=|:)?\s*(blue|red|green|black|white|yellow|purple|gray|transparent|#[0-9a-fA-F]{3,6})/i
    );

    if (columnColorMatch) {
      const color = columnColorMatch[1].toLowerCase();
      const currentColumns = currentProps.columns || currentProps.props?.columns || [];
      
      // Update all columns with the new background color
      const updatedColumns = currentColumns.map(column => ({
        ...column,
        backgroundColor: color
      }));

      return {
        props: this.updateNestedProps(currentProps, {
          columns: updatedColumns
        })
      };
    }

    // Handle column operations
    if (
      lowercaseInput.includes("add column") ||
      lowercaseInput.includes("create column")
    ) {
      const titleMatch = input.match(
        /(?:add|create)\s+column\s+(?:called|named|with title|titled)?\s*["']?([^"']+)["']?/i
      );
      if (titleMatch) {
        const columnTitle = titleMatch[1].trim();
        const newColumn = {
          id: `col${Date.now()}`,
          title: columnTitle,
          tasks: [],
        };

        const currentColumns =
          currentProps.columns || currentProps.props?.columns || [];
        const updatedColumns = [...currentColumns, newColumn];

        return {
          props: this.updateNestedProps(currentProps, {
            columns: updatedColumns,
          }),
        };
      }
    }

    // Handle task operations
    if (
      lowercaseInput.includes("add task") ||
      lowercaseInput.includes("create task")
    ) {
      const taskMatch = input.match(
        /(?:add|create)\s+task\s+(?:called|named|with title|titled)?\s*["']?([^"']+)["']?\s*(?:in|to)\s+(?:column|list)?\s*["']?([^"']+)["']?/i
      );
      if (taskMatch) {
        const [_, taskTitle, columnTitle] = taskMatch;
        const columns =
          currentProps.columns || currentProps.props?.columns || [];
        const targetColumn = columns.find(
          (col) => col.title.toLowerCase() === columnTitle.toLowerCase().trim()
        );

        if (targetColumn) {
          const currentTasks =
            currentProps.tasks || currentProps.props?.tasks || [];
          const newTask = {
            id: `task${Date.now()}`,
            title: taskTitle.trim(),
            columnId: targetColumn.id,
            description: "",
            createdAt: new Date().toISOString(),
          };

          const updatedTasks = [...currentTasks, newTask];

          return {
            props: this.updateNestedProps(currentProps, {
              tasks: updatedTasks,
            }),
          };
        }
      }
    }

    // Handle moving tasks
    if (lowercaseInput.includes("move task")) {
      const moveMatch = input.match(
        /move\s+task\s+["']?([^"']+)["']?\s+(?:from\s+["']?([^"']+)["']?\s+)?to\s+["']?([^"']+)["']?/i
      );
      if (moveMatch) {
        const [_, taskTitle, fromColumn, toColumn] = moveMatch;
        const columns =
          currentProps.columns || currentProps.props?.columns || [];
        const tasks = currentProps.tasks || currentProps.props?.tasks || [];

        const sourceColumn = fromColumn
          ? columns.find(
              (col) =>
                col.title.toLowerCase() === fromColumn.toLowerCase().trim()
            )
          : columns.find((col) =>
              tasks.some(
                (task) =>
                  task.columnId === col.id &&
                  task.title.toLowerCase() === taskTitle.toLowerCase().trim()
              )
            );

        const targetColumn = columns.find(
          (col) => col.title.toLowerCase() === toColumn.toLowerCase().trim()
        );

        if (sourceColumn && targetColumn) {
          const taskToMove = tasks.find(
            (task) =>
              task.columnId === sourceColumn.id &&
              task.title.toLowerCase() === taskTitle.toLowerCase().trim()
          );

          if (taskToMove) {
            const updatedTasks = tasks.map((task) =>
              task.id === taskToMove.id
                ? { ...task, columnId: targetColumn.id }
                : task
            );

            return {
              props: this.updateNestedProps(currentProps, {
                tasks: updatedTasks,
              }),
            };
          }
        }
      }
    }

    // Handle column style changes
    const columnStylePatterns = this.getStylePatterns().columnStyle;
    for (const pattern of columnStylePatterns) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const [_, value] = match;
        if (lowercaseInput.includes("border")) {
          return {
            props: this.updateNestedProps(currentProps, {
              columnBorderStyle: {
                ...(currentProps.columnBorderStyle || {}),
                border: value,
              },
            }),
          };
        }
        if (lowercaseInput.includes("padding")) {
          return {
            props: this.updateNestedProps(currentProps, {
              columnPadding: value,
            }),
          };
        }
        // Default to background color change
        return {
          props: this.updateNestedProps(currentProps, {
            columnBackgroundColor: value,
          }),
        };
      }
    }

    // Handle task style changes
    const taskStylePatterns = this.getStylePatterns().taskStyle;
    for (const pattern of taskStylePatterns) {
      const match = lowercaseInput.match(pattern);
      if (match) {
        const [_, value] = match;
        if (lowercaseInput.includes("border")) {
          return {
            props: this.updateNestedProps(currentProps, {
              taskBorderStyle: {
                ...(currentProps.taskBorderStyle || {}),
                border: value,
              },
            }),
          };
        }
        // Default to background color change
        return {
          props: this.updateNestedProps(currentProps, {
            taskBackgroundColor: value,
          }),
        };
      }
    }

    return null;
  }
}
