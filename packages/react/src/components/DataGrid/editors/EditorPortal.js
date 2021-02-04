import React from 'react';
import ReactDOM from 'react-dom';

export default function EditorPortal({ target, children }) {
  // Keep track of when the modal element is added to the DOM
  const [isMounted, setIsMounted] = React.useState(false);

  React.useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render the portal until the component has mounted,
  // So the portal can safely access the DOM.
  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(children, target);
}
