
import React from 'react';
import pokeball from '../assets/pokeball2_0.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


import './PokemonModal.scss';

function PokemonModal({ name, spriteUrl, weight, height, type, habitat, evoChain, description, eggGroups, shape, color, gender, capture_rate, growth_rate, has_gender_differences, varieties, isLegendary, isMythical, onClose, translatedNames, filteredList, setSelectedPokemon, handleClickFromParent }) {
  // Posición del Pokémon actual en la lista filtrada
  const currentIndex = filteredList.findIndex(p => p.name === name);

  // Ir al siguiente
  const goNext = () => {
    if (currentIndex < filteredList.length - 1) {
      const next = filteredList[currentIndex + 1];
      // Re-usa la lógica del padre: simplemente “simulas” un click al pasar
      // el objeto con name y url; el padre se encargará de hacer fetch y set.
      setSelectedPokemon(null);               // cierra modal mientras carga
      handleClickFromParent(next);            // ver nota ↓
    }
  };

  // Ir al anterior
  const goPrev = () => {
    if (currentIndex > 0) {
      const prev = filteredList[currentIndex - 1];
      setSelectedPokemon(null);
      handleClickFromParent(prev);
    }
  };





  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>


        <div className="modalInfo">
          <button className="closeButton" onClick={onClose}><span className="cancelIcon"><FontAwesomeIcon icon={faXmark} /></span></button>
          <div className="navButtons">
            <button onClick={goPrev} disabled={currentIndex === 0}><span className="arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
            <p className="modalName"><img className="pokeballImg" src={pokeball} alt="pokeball" />{translatedNames[name] || name.charAt(0).toUpperCase() + name.slice(1)}
              <img className="pokeballImg" src={pokeball} alt="pokeball" /></p>
            <button onClick={goNext} disabled={currentIndex === filteredList.length - 1}><span className="arrow"><FontAwesomeIcon icon={faArrowRight} /></span></button>
          </div>



          <div className="main">
            <img src={spriteUrl} alt={name} className="modalSprite" />
            <div className="mainData">

              <p><span className="attText">Tipo: </span> {type.join(' / ')}</p>
              <p><span className="attText">Peso:  </span>{weight} kg</p>
              <p><span className="attText">Altura:  </span>{height} m</p>
              <p><span className="attText">Habitat: </span> {habitat.charAt(0).toUpperCase() + habitat.slice(1)}</p>


            </div>
            <div className="desc">
              <p className="legendMythic">{isLegendary}{isMythical}</p>
              <p>{description}</p>

            </div>
          </div>

          <div className="otherData">

            <div className="otherDataBox">

              <p><span className="attText">Forma: </span>{shape}</p>
              <p><span className="attText">Color: </span>{color}</p>
              <p><span className="attText">Diferencia de género: </span>{has_gender_differences}</p>
            </div>


            <div className="otherDataBox">
              <p><span className="attText">Grupo Huevo: </span>{eggGroups.join(' / ')}</p>
              <p className="attText">Ratio de género: </p><p>{gender}</p>

            </div>

            <div className="otherDataBox">

              <p><span className="attText">Ratio de captura: </span> {capture_rate}</p>
              <p><span className="attText">Tasa de crecimeinto:</span> {growth_rate}</p>
            </div>

          </div>
          <h3 className="attText">Variaciones:</h3>
          <div className="varieties-chain">

            <ul className="varietiesList">
              {varieties.map((v, index) => (
                <li key={index} className="variety-stage">
                  <img src={v.sprite} alt={v.name} width="50" />
                  <p>{v.name.charAt(0).toUpperCase() + v.name.slice(1)}</p>
                </li>
              ))}
            </ul>
          </div>



          {Array.isArray(evoChain) && evoChain.length > 0 && (
            <div className="evolution-chain">
              <div className="evolution-list">
                {evoChain.map((evo, index) => (
                  <div key={index} className="evolution-stage">
                    <p>{evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
                    <div className="evoImg"><img src={evo.image} alt={evo.name} /></div>
                    <div className="evoData">
                    
                    {evo.method && <p className="evo-method"> {evo.method}</p>}
                    
                    </div>

                    
                    
                  </div>
                ))}
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
