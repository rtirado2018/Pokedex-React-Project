
import React from 'react';
import pokeball from '../assets/pokeball2_0.png';


import './PokemonModal.scss';

function PokemonModal({ name, spriteUrl, weight, height, type, habitat, evoChain, description, eggGroups, shape, color, gender, capture_rate, growth_rate, has_gender_differences, varieties, isLegendary, isMythical, onClose, translatedNames }) {
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>


        <div className="modalInfo">
          <button className="closeButton" onClick={onClose}>×</button>

          <p className="modalName"><img className="pokeballImg" src={pokeball} alt="pokeball" />{translatedNames[name] || name.charAt(0).toUpperCase() + name.slice(1)}
          <img className="pokeballImg" src={pokeball} alt="pokeball" /></p>

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
                  <li key={index}className="variety-stage">
                    <img src={v.sprite} alt={v.name} width="50" />
                    <p>{v.name.charAt(0).toUpperCase()+v.name.slice(1)}</p>
                  </li>
                ))}
              </ul>
          </div>



          <h3>Cadena evolutiva</h3>
          {evoChain && (
            <div className="evolution-chain">

              <div className="evolution-list">
                {evoChain.map((evo, index) => (
                  <div key={index} className="evolution-stage">
                    <img src={evo.image} alt={evo.name} />
                    <p>{evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}</p>
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
