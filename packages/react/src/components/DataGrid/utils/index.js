export * from './domUtils';
export * from './columnUtils';
export * from './viewportUtils';
export * from './keyboardUtils';
export * from './selectedCellUtils';

export function assertIsValidKey(key) {
  if (key === undefined) {
    throw new Error('Please specify the rowKey prop to use selection');
  }
}

export function wrapRefs(...refs) {
  return handle => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(handle);
      } else if (ref !== null) {
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
        // @ts-expect-error
        ref.current = handle;
      }
    }
  };
}
