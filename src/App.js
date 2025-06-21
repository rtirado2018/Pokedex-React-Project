import React, { useState } from 'react';
import PokemonList from './components/PokemonList';
import GenerationFilter from './components/GenerationFilter';
import TypeFilter from './components/TypeFilter';
import pokeball from './assets/pokeball2_0.png';
import './App.css';

function App() {
  const [selectedGeneration, setSelectedGeneration] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  return (
    <div className="App">
      <h1><img className="pokeballImg" src={pokeball} alt="pokeball" />React Pokédex Project<img className="pokeballImg" src={pokeball} alt="pokeball" /></h1>

      <div className="filters">
        <GenerationFilter selectedGen={selectedGeneration} onChange={setSelectedGeneration} />
        <TypeFilter selectedType={selectedType} onChange={setSelectedType} />

      </div>


      <div className="mainContainer"><PokemonList
        selectedGeneration={selectedGeneration}
        selectedType={selectedType}
      />
      </div>

    </div>

  );
}

export default App;
