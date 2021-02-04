import PropTypes from 'prop-types';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

function wrapRefs(...refs) {
  return (handle) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(handle);
      } else if (ref !== null) {
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
        ref.current = handle;
      }
    }
  };
}

export function DraggableHeaderRenderer({ onColumnsReorder, ...props }) {
  const [{ isDragging }, drag] = useDrag({
    item: { key: props.column.key, type: 'COLUMN_DRAG' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'COLUMN_DRAG',
    drop({ key, type }) {
      if (type === 'COLUMN_DRAG') {
        onColumnsReorder(key, props.column.key);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={wrapRefs(drag, drop)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#ececec' : 'inherit',
        cursor: 'move',
      }}>
      {props.column.name}
    </div>
  );
}

DraggableHeaderRenderer.propTypes = {
  onColumnsReorder: PropTypes.any,
  column: PropTypes.any,
};
