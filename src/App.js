import React from 'react';
import PokemonList from './components/PokemonList';
import pokeball from './assets/pokeball2_0.png';
import './App.css';

function App() {
  return (
    <div className="App">

              
      <h1><img className="pokeballImg" src={pokeball} alt="pokeball" />React Pokédex Project<img className="pokeballImg" src={pokeball} alt="pokeball" /></h1>
      <div className="mainContainer"><PokemonList /></div>
  
  </div>
   
  );
}

export default App;
