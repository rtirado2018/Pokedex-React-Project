import React from 'react';

import './Filters.scss';
function GenerationFilter({ selectedGen, onChange }) {
    const generations = [
        { label: 'Todas', value: 'all' },
        { label: 'Gen I', value: 'generation-i' },
        { label: 'GenII', value: 'generation-ii' },
        { label: 'Gen III', value: 'generation-iii' },
        { label: 'GenIV', value: 'generation-iv' },
        { label: 'Gen V', value: 'generation-v' },
        { label: 'GenVI', value: 'generation-vi' },
        { label: 'Gen VII', value: 'generation-vii' },
        { label: 'GenVIII', value: 'generation-viii' },
        { label: 'GenIX', value: 'generation-ix' },

    ];

    return (
        <div className="filterContainer">
            <label>Filtrar por generación:</label>

            <select value={selectedGen} onChange={(e) => onChange(e.target.value)}>
                {generations.map((gen) => (
                    <option key={gen.value} value={gen.value}>{gen.label}</option>
                ))}
            </select>

        </div>
    );
}

export default GenerationFilter;