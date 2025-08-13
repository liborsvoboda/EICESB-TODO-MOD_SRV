import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { codeRangeSyncSourceState } from '../../features/code-range-sync/codeRangeSyncSourceState';
import { codeRangeSyncTargetState } from '../../features/code-range-sync/codeRangeSyncTargetState';
import type { AstItem } from '../../shared/resultTypes';
import { AstNodeList } from './internal/AstNodeList';
import { AstSelectionContext } from './internal/AstSelectionContext';
import { findItemPathByOffset } from './internal/findItemPathByOffset';
import { parseRangeFromItem } from './internal/parseRangeFromItem';
import { DEFAULT_SELECTION_STATE, selectionReducer } from './internal/selection';

type Props = {
    roots: ReadonlyArray<AstItem>;
    // Storybook/Tests only
    initialState?: {
        expanded?: boolean;
    };
};

export const AstView: React.FC<Props> = ({ roots, initialState }) => {
    const setSourceRange = useSetRecoilState(codeRangeSyncSourceState);
    const targetOffset = useRecoilValue(codeRangeSyncTargetState);

    const [selectionState, dispatchSelectionAction] = useReducer(selectionReducer, DEFAULT_SELECTION_STATE);

    useEffect(() => {
        const range = parseRangeFromItem(selectionState.selectedItem);
        setSourceRange(range);
    }, [selectionState.selectedItem, setSourceRange]);
    useEffect(() => {
        if (!targetOffset)
            return;

        const selectedPath = findItemPathByOffset(roots, targetOffset);
        dispatchSelectionAction({ type: 'select-from-external-offset', selectedPath });
    }, [roots, targetOffset]);

    const onMouseOver = useMemo(() => {
        if (selectionState.selectionMode === 'hover')
            return;

        return () => dispatchSelectionAction({ type: 'enable-hover-selection' });
    }, [selectionState.selectionMode]);
    const onMouseOut = useCallback(() => dispatchSelectionAction({ type: 'deselect-all' }), []);

    const selectionContext = useMemo(() => ({
        selectionState,
        dispatchSelectionAction
    }), [selectionState, dispatchSelectionAction]);

    return <div className="ast" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        <AstSelectionContext.Provider value={selectionContext}>
            <AstNodeList items={roots} initialState={initialState} />
        </AstSelectionContext.Provider>
    </div>;
};