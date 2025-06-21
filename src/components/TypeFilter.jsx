import React from 'react';

import './Filters.scss';

function TypeFilter({ selectedType, onChange }) {
    const types = [
        { label: 'Todos', value: 'all' },
        { label: 'Normal', value: 'normal' },
        { label: 'Planta', value: 'grass' },
        { label: 'Fuego', value: 'fire' },
        { label: 'Agua', value: 'water' },
        { label: 'Eléctrico', value: 'electric' },
        { label: 'Bicho', value: 'bug' },
        { label: 'Lucha', value: 'fighting' },
        { label: 'Veneno', value: 'poison' },
        { label: 'Psíquico', value: 'psychic' },
        { label: 'Tierra', value: 'ground' },
        { label: 'Roca', value: 'rock' },
        { label: 'Hielo', value: 'ice' },
        { label: 'Fantasma', value: 'ghost' },
        { label: 'Dragón', value: 'dragon' },
        { label: 'Siniestro', value: 'dark' },
        { label: 'Acero', value: 'steel' },
        { label: 'Hada', value: 'fairy' },
        
 

    ];

    return (
        <div className="filterContainer">
            <label>Filtrar por tipo</label>

            <select value={selectedType} onChange={(e) => onChange(e.target.value)}>
                {types.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                ))}
            </select>

        </div>
    );
}

export default TypeFilter;
