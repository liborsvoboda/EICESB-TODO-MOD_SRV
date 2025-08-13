import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import type { AstItem } from '../../../shared/resultTypes';
import { AstNodeList } from './AstNodeList';
import { AstSelectionContext } from './AstSelectionContext';

type Props = {
    item: AstItem;
    // Storybook/Tests only
    initialState?: {
        expanded?: boolean;
    };
};

const escapeCommon = (value: string) => {
    return value
        .replace('\r', '\\r')
        .replace('\n', '\\n')
        .replace('\t', '\\t');
};

const escapeTrivia = (value: string) => {
    return escapeCommon(value)
        .replace(/(^ +| +$)/g, (_, $1: string) => $1.length > 1 ? `<space:${$1.length}>` : '<space>');
};

const renderValue = (value: string | number | boolean, type: string) => {
    if (typeof value !== 'string')
        return value.toString();

    if (type === 'trivia')
        return escapeTrivia(value);

    return escapeCommon(value);
};

export const AstNode: React.FC<Props> = ({ item, initialState }) => {
    const titleElementRef = useRef<HTMLSpanElement>(null);
    const [expanded, setExpanded] = useState<boolean>(initialState?.expanded ?? false);
    const { selectionState, dispatchSelectionAction } = useContext(AstSelectionContext);
    const { selectionMode, selectedItem, selectedItemSource } = selectionState;

    const selected = selectedItem === item;

    useEffect(() => {
        if (selectionState.expansionPath.has(item))
            setExpanded(true);
    }, [item, selectionState.expansionPath]);

    useLayoutEffect(() => {
        if (selected && selectedItemSource === 'external' && titleElementRef.current)
            scrollIntoView(titleElementRef.current, { scrollMode: 'if-needed' });
    }, [selected, selectedItemSource]);

    const children = useMemo(() => {
        if (item.properties) {
            const childrenFromProperties = Object
                .entries(item.properties)
                .map(([name, value]) => ({ type: 'property-only', property: name, value } as AstItem));
            if (!item.children)
                return childrenFromProperties;

            return childrenFromProperties.concat(item.children);
        }

        return item.children;
    }, [item]);

    const onClick = useCallback(() => {
        setExpanded(e => !e);
        // select-on-click is only enabled in mobile and such
        if (selectionMode === 'click')
            dispatchSelectionAction({ type: 'select-from-child', item });
    }, [item, selectionMode, dispatchSelectionAction]);

    const onMouseOver = useCallback(() => {
        if (selectionMode === 'hover')
            dispatchSelectionAction({ type: 'select-from-child', item });
    }, [item, selectionMode, dispatchSelectionAction]);

    const hasChildren = !!children?.length;
    const className = [
        expanded ? null : 'collapsed',
        selected ? 'selected' : null,
        hasChildren ? null : 'leaf'
    ].filter(c => c).join(' ');

    return <li className={className}>
        <span className={`ast-item-wrap ast-item-${item.type}`} ref={titleElementRef} onClick={onClick} onMouseOver={onMouseOver}>
            {hasChildren && <button />}
            <span className="ast-item-type" title={item.type}></span>
            {item.property && <span className="ast-item-property">{item.property}:</span>}
            {item.value && <span className="ast-inline-value">{renderValue(item.value, item.type)}</span>}
            <span className="ast-item-kind">{item.kind}</span>
        </span>
        {hasChildren && expanded && <AstNodeList items={children} initialState={initialState} />}
    </li>;
};