import React, { useMemo, useState } from 'react';
import { asLookup } from '../../../shared/helpers/asLookup';
import type { MemoryInspection } from '../../../shared/resultTypes';
import { Select } from '../../../shared/Select';
import { calculateLabelLevels, FinalLabel } from './memory/memoryLabels';


type Mode = 'decimal'|'hex'|'char';
const modeOptions = [
    { value: 'decimal', label: 'Decimal' },
    { value: 'hex', label: 'Hex' },
    { value: 'char', label: 'Char' }
] as const;

const specialChars = asLookup({
    '\r': '\\r',
    '\n': '\\n',
    '\t': '\\t',
    '\0': '\\0'
} as const);

type Props = {
    inspection: MemoryInspection;
    // Storybook/Tests only
    initialState?: {
        mode?: Mode;
    };
};

export const MemoryOutput: React.FC<Props> = ({ inspection, initialState }) => {
    const [mode, setMode] = useState<Mode>(initialState?.mode ?? 'decimal');
    const labelLevels = useMemo(() => calculateLabelLevels(inspection.labels, inspection.data.length), [inspection]);

    const renderLabel = ({ name, length, levelSpan }: FinalLabel, index: number) =>
        <td key={index}
            className="inspection-data-label"
            colSpan={length}
            rowSpan={levelSpan}
            title={name}>{name}</td>;

    const renderLabelLevel = (labels: ReadonlyArray<FinalLabel>, index: number) =>
        <tr key={index}>{labels.map(renderLabel)}</tr>;

    const renderByte = (byte: number) => {
        switch (mode) {
            case 'decimal': return byte.toString().padStart(3, '0');
            case 'hex': return byte.toString(16).toUpperCase().padStart(2, '0');
            case 'char': {
                const char = String.fromCharCode(byte);
                return specialChars[char] ?? char;
            }
            default: return '??';
        }
    };

    return <div className="inspection inspection-memory">
        <header>
            <span className="inspection-title">{inspection.title}</span>
            <Select<Mode> value={mode} options={modeOptions} onSelect={setMode} />
        </header>
        <table>
            {labelLevels.map(renderLabelLevel)}
            <tr>
                {inspection.data.map((byte, index) => <td key={index} className={`inspection-data-cell${byte === 0 ? ' inspection-data-zero' : ''}`}>
                    {renderByte(byte)}
                </td>)}
            </tr>
        </table>
    </div>;
};