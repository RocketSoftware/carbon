import faker from 'faker';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AutoSizer } from 'react-virtualized';
import DataGrid, { SelectColumn, UpdateActions } from '../../DataGrid';
import DropDownEditor from '../components/Editors/DropDownEditor';
import { ImageFormatter } from '../components/Formatters';
import Toolbar from '../components/Toolbar/Toolbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DraggableHeaderRenderer } from '../components/HeaderRenderers';

import './AllFeatures.scss';

faker.locale = 'en_US';

const titles = ['Dr.', 'Mr.', 'Mrs.', 'Miss', 'Ms.'];
/* eslint-disable */
function createFakeRowObjectData(index) {
  return {
    id: `id_${index}`,
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
    title: faker.name.prefix(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.streetName(),
    zipCode: faker.address.zipCode(),
    date: faker.date.past().toLocaleDateString(),
    bs: faker.company.bs(),
    catchPhrase: faker.company.catchPhrase(),
    companyName: faker.company.companyName(),
    words: faker.lorem.words(),
    sentence: faker.lorem.sentence(),
  };
}

function createRows(numberOfRows) {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }

  return rows;
}

function isAtBottom(event) {
  const target = event.target;
  return target.clientHeight + target.scrollTop === target.scrollHeight;
}

function loadMoreRows(newRowsCount, length) {
  return new Promise((resolve) => {
    const newRows = [];

    for (let i = 0; i < newRowsCount; i++) {
      newRows[i] = createFakeRowObjectData(i + length);
    }

    setTimeout(() => resolve(newRows), 1000);
  });
}

function createColumns() {
  return [
    SelectColumn,
    {
      key: 'id',
      name: 'ID',
      width: 80,
      resizable: true,
      frozen: true,
    },
    {
      key: 'avatar',
      name: 'Avatar',
      width: 40,
      resizable: true,
      headerRenderer: () => <ImageFormatter value={faker.image.cats()} />,
      formatter: ({ row }) => <ImageFormatter value={row.avatar} />,
    },
    {
      key: 'title',
      name: 'Title',
      editor: React.forwardRef((props, ref) => (
        <DropDownEditor ref={ref} {...props} options={titles} />
      )),
      width: 200,
      resizable: true,
      formatter(props) {
        return <>{props.row.title}</>;
      },
    },
    {
      key: 'firstName',
      name: 'First Name',
      editable: true,
      width: 200,
      resizable: true,
      frozen: true,
    },
    {
      key: 'lastName',
      name: 'Last Name',
      editable: true,
      width: 200,
      resizable: true,
      frozen: true,
    },
    {
      key: 'email',
      name: 'Email',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'street',
      name: 'Street',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'zipCode',
      name: 'ZipCode',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'date',
      name: 'Date',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'bs',
      name: 'bs',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'catchPhrase',
      name: 'Catch Phrase',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'companyName',
      name: 'Company Name',
      editable: true,
      width: 200,
      resizable: true,
    },
    {
      key: 'sentence',
      name: 'Sentence',
      editable: true,
      width: 200,
      resizable: true,
    },
  ];
}

export default function AllFeatures() {
  const [rows, setRows] = useState(() => createRows(2000));
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [columns, setColumns] = useState(createColumns);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef(null);

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

  const handleRowUpdate = useCallback(
    ({ fromRow, toRow, updated, action }) => {
      const newRows = [...rows];
      let start;
      let end;

      if (action === UpdateActions.COPY_PASTE) {
        start = toRow;
        end = toRow;
      } else {
        start = Math.min(fromRow, toRow);
        end = Math.max(fromRow, toRow);
      }

      for (let i = start; i <= end; i++) {
        newRows[i] = { ...newRows[i], ...updated };
      }

      setRows(newRows);
    },
    [rows]
  );

  const handleAddRow = useCallback(
    (newRowIndex) => setRows([...rows, createFakeRowObjectData(newRowIndex)]),
    [rows]
  );

  const handleRowClick = useCallback((rowIdx, row, column) => {
    if (column.key === 'title') {
      gridRef.current?.selectCell({ rowIdx, idx: column.idx }, true);
    }
  }, []);

  async function handleScroll(event) {
    if (!isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await loadMoreRows(50, rows.length);

    setRows([...rows, ...newRows]);
    setIsLoading(false);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar onAddRow={handleAddRow} numberOfRows={rows.length} />
      <AutoSizer>
        {({ height, width }) => {
          return (
            <>
              <DndProvider backend={HTML5Backend}>
                <DataGrid
                  ref={gridRef}
                  columns={draggableColumns}
                  rows={rows}
                  rowKey="id"
                  onRowsUpdate={handleRowUpdate}
                  onRowClick={handleRowClick}
                  rowHeight={30}
                  width={width}
                  height={height - 40}
                  selectedRows={selectedRows}
                  onScroll={handleScroll}
                  onSelectedRowsChange={setSelectedRows}
                  rowClass={(row) =>
                    row.id.includes('7') ? 'highlight' : undefined
                  }
                />
                {isLoading && (
                  <div
                    className="load-more-rows-tag"
                    style={{ left: width - 230 }}>
                    Loading more rows...
                  </div>
                )}
              </DndProvider>
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
}
/* eslint-enable */
