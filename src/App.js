import React,{useState} from 'react';
import PokemonList from './components/PokemonList';
import GenerationFilter from './components/GenerationFilter';
import pokeball from './assets/pokeball2_0.png';
import './App.css';

function App() {
  const [selectedGeneration , setSelectedGeneration]= useState('all')
  return (
    <div className="App">

              
      <h1><img className="pokeballImg" src={pokeball} alt="pokeball" />React Pokédex Project<img className="pokeballImg" src={pokeball} alt="pokeball" /></h1>
      <GenerationFilter selectedGen={selectedGeneration} onChange={setSelectedGeneration}/>
      <div className="mainContainer"><PokemonList selectedGeneration={selectedGeneration} />
      </div>
  
  </div>
   
  );
}

export default App;
