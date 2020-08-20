import React, { useState } from 'react';
import cx from 'classnames';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

function CellAction({ icon, actions, callback, isFirst }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reference, setReference] = useState(null);
  const [popper, setPopper] = useState(null);
  const { styles } = usePopper(reference, popper, {
    placement: 'bottom-start',
    modifiers: [{ name: 'offset', options: { offset: [0, -8] } }],
  });

  const cellActionClasses = cx('rdg-cell-action', {
    'rdg-cell-action-last': isFirst,
  });

  const actionButtonClasses = cx('rdg-cell-action-button', {
    'rdg-cell-action-button-toggled': isOpen,
  });

  function onActionIconClick() {
    if (typeof callback === 'function') {
      callback();
    }

    if (actions && actions.length > 0) {
      setIsOpen(!isOpen);
    }
  }

  return (
    <div className={cellActionClasses} onMouseLeave={() => setIsOpen(false)}>
      <div
        ref={setReference}
        className={actionButtonClasses}
        onClick={onActionIconClick}>
        {icon}
      </div>
      {isOpen &&
        actions &&
        actions.length &&
        createPortal(
          <div
            ref={setPopper}
            className="rdg-cell-action-menu"
            style={styles.popper}>
            {actions.map((action, index) => (
              <span key={index} onClick={action.callback}>
                {action.text}
              </span>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export function CellActionsFormatter({ actions }) {
  const actionButtons = actions.map((action, index) => {
    return <CellAction key={index} isFirst={index === 0} {...action} />;
  });

  return <>{actionButtons}</>;
}
