import React, { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Select, SelectHTMLProps } from '../../shared/Select';
import { languageOptionState } from '../../shared/state/languageOptionState';
import { branchesState } from './branchesState';
import { branchOptionState } from './branchOptionState';
import { groupAndSortBranches } from './internal/groupAndSortBranches';

type Props = {
    useAriaLabel?: boolean;
} & Omit<SelectHTMLProps, 'aria-label'>;

export const BranchSelect: React.FC<Props> = ({ useAriaLabel, ...htmlProps }) => {
    const allBranches = useRecoilValue(branchesState);
    const language = useRecoilValue(languageOptionState);
    const [branch, setBranch] = useRecoilState(branchOptionState);

    const options = useMemo(() => {
        // eslint-disable-next-line prefer-const
        let { ungrouped, groups } = groupAndSortBranches(allBranches);
        if (language === 'F#')
            groups = groups.filter(g => g.kind !== 'roslyn');

        return [
            { label: 'Default', value: '' },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...ungrouped.map(({ displayName, id }) => ({ label: displayName!, value: id })),
            ...groups.map(({ name, branches }) => ({
                groupLabel: name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                options: branches.map(({ displayName, id }) => ({ label: displayName!, value: id }))
            }))
        ];
    }, [allBranches, language]);

    return <Select<string>
        className="option-branch option"
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        value={branch?.id ?? ''}
        options={options}
        onSelect={id => setBranch(allBranches.find(b => b.id === id) ?? null)}
        // eslint-disable-next-line no-undefined
        aria-label={useAriaLabel ? 'Platform or Roslyn branch' : undefined}
        {...htmlProps}
    />;
};