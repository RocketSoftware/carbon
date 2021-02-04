import { useMemo } from 'react';
import mergeRefs from '../../../tools/mergeRefs';

export function useCombinedRefs(...refs) {
  return useMemo(
    () => mergeRefs(...refs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
