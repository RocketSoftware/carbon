import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DraggableHeaderRenderer } from '../components/HeaderRenderers';
import DataGrid from '../../DataGrid';

function createRows() {
  const rows = [];
  for (let i = 1; i < 500; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ['Critical', 'High', 'Medium', 'Low'][
        Math.round(Math.random() * 3)
      ],
      issueType: ['Bug', 'Improvement', 'Epic', 'Story'][
        Math.round(Math.random() * 3)
      ],
    });
  }

  return rows;
}

function createColumns() {
  return [
    {
      key: 'id',
      name: 'ID',
      width: 80,
    },
    {
      key: 'task',
      name: 'Title',
      resizable: true,
      sortable: true,
    },
    {
      key: 'priority',
      name: 'Priority',
      resizable: true,
      sortable: true,
    },
    {
      key: 'issueType',
      name: 'Issue Type',
      resizable: true,
      sortable: true,
    },
    {
      key: 'complete',
      name: '% Complete',
      resizable: true,
      sortable: true,
    },
  ];
}

export default function ColumnsReordering() {
  const [rows] = useState(createRows);
  const [columns, setColumns] = useState(createColumns);
  const [[sortColumn, sortDirection], setSort] = useState(['task', 'NONE']);

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  const draggableColumns = useMemo(() => {
    function HeaderRenderer(props) {
      return (
        <DraggableHeaderRenderer
          {...props}
          onColumnsReorder={handleColumnsReorder}
        />
      );
    }

    function handleColumnsReorder(sourceKey, targetKey) {
      const sourceColumnIndex = columns.findIndex((c) => c.key === sourceKey);
      const targetColumnIndex = columns.findIndex((c) => c.key === targetKey);
      const reorderedColumns = [...columns];

      reorderedColumns.splice(
        targetColumnIndex,
        0,
        reorderedColumns.splice(sourceColumnIndex, 1)[0]
      );

      setColumns(reorderedColumns);
    }

    return columns.map((c) => {
      if (c.key === 'id') return c;
      return { ...c, headerRenderer: HeaderRenderer };
    });
  }, [columns]);

  const sortedRows = useMemo(() => {
    if (sortDirection === 'NONE') return rows;

    let sortedRows = [...rows];

    switch (sortColumn) {
      case 'task':
      case 'priority':
      case 'issueType':
        sortedRows = sortedRows.sort((a, b) =>
          a[sortColumn].localeCompare(b[sortColumn])
        );
        break;
      case 'complete':
        sortedRows = sortedRows.sort((a, b) => a[sortColumn] - b[sortColumn]);
        break;
      default:
    }

    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [rows, sortDirection, sortColumn]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DataGrid
        columns={draggableColumns}
        rows={sortedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </DndProvider>
  );
}
