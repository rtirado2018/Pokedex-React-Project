import React, { useEffect, useState } from 'react';
import PokemonModal from './PokemonModal';
import translations from './translationMaps';
import { evoChain } from './EvolutionUtils';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';




import './PokemonList.scss';

function PokemonList({ selectedGeneration, selectedType }) {

  const [pokemon, setPokemon] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});
  const visiblePokemon = filteredList.slice(0, visibleCount);

  const [showButton, setShowButton] = useState(false);
  
//LÓGICA DE APARICIÓN DEL BOTÓN DE VOLVER
useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY > 800); 
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  useEffect(() => {
    const loadTranslatedNames = async () => {
      const newNames = {};
      for (const p of visiblePokemon) {
        const id = getIdFromUrl(p.url);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const data = await res.json();
        const translated = getTranslatedName(data);
        newNames[p.name] = translated;
      }
      setTranslatedNames(prev => ({ ...prev, ...newNames }));
    };

    loadTranslatedNames();
  }, [visibleCount]); // se vuelve a lanzar cuando hay más Pokémon visibles


  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0')
      .then(res => res.json())
      .then(data => setPokemon(data.results));
  }, []);

  const getIdFromUrl = (url) => {
    const match = url.match(/\/pokemon\/(\d+)\//);
    if (match) return match[1];
  
    // Si no tiene número, saca el nombre del final de la URL
    const nameMatch = url.match(/\/pokemon\/([^/]+)\/?$/);
    if (nameMatch) return nameMatch[1];
  
    return null;
  };
  

  

  
  
  const fetchDescription = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const data = await res.json();
    const entry = data.flavor_text_entries.find(e => e.language.name === 'es');
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'No description found.';
  };

  const fetchTypeNamesInSpanish = async (types) => {
    const promises = types.map(async (type) => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();
      const nameEs = data.names.find(n => n.language.name === 'es');
      return nameEs ? nameEs.name : type;
    });

    return Promise.all(promises);
  };

  //LÓGICA DE FILTRO  

  useEffect(() => {
    const fetchFilteredPokemon = async () => {
      if (selectedType !== 'all') {
        // Filtrar por tipo
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        const data = await res.json();
        // data.pokemon es un array con {pokemon: {name, url}, slot}
        const pokemonOfType = data.pokemon.map(p => p.pokemon);
  
        let filtered = pokemonOfType;
  
        // Si además filtras por generación
        if (selectedGeneration !== 'all') {
          const genRes = await fetch(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const genData = await genRes.json();
          const speciesNames = genData.pokemon_species.map(p => p.name);
          filtered = filtered.filter(p => speciesNames.includes(p.name));
        }
  
        setFilteredList(filtered);
        setVisibleCount(10);
        return;
      }
  
      // Si es 'all', filtras solo por generación o muestras todo
      let filtered = [...pokemon];
      if (selectedGeneration !== 'all') {
        const res = await fetch(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
        const data = await res.json();
        const speciesNames = data.pokemon_species.map(p => p.name);
        filtered = filtered.filter(p => speciesNames.includes(p.name));
      }
  
      setFilteredList(filtered);
      setVisibleCount(10);
    };
  
    fetchFilteredPokemon();
  }, [selectedGeneration, selectedType, pokemon]);
  

  //LÓGICA DE TRADUCCIÓN

  const getTranslatedName = (data, lang = 'es') => {
    return data.names?.find(n => n.language.name === lang)?.name || data.name || 'Desconocido';
  };

  const getIdFromName = (name) => {
    const poke = pokemon.find(p => p.name === name.toLowerCase());
    if (!poke) return null;
    return getIdFromUrl(poke.url);
  };
  

  const handleClick = async (p) => {
    
    const id = getIdFromUrl(p.url);
    if (!id) {
      console.error("❌ ID inválido extraído desde la URL:", p.url);
      alert("Este Pokémon tiene una URL inválida. ¡Ups!");
      return;
    }
    console.log(`▶️ Click en: ${p.name}, ID: ${id}`);
    
  
    try {
      // 1. Especie
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      if (!speciesRes.ok) throw new Error(`speciesRes failed: ${speciesRes.status}`);
      const speciesData = await speciesRes.json();
  
      // 2. Datos físicos
      const phisycallRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!phisycallRes.ok) throw new Error(`phisycallRes failed: ${phisycallRes.status}`);
      const phisycallData = await phisycallRes.json();
  
      // 3. Imagen
      const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  
      // 4. Tipos
      const typeNames = phisycallData.types.map(t => t.type.name);
      const typesInSpanish = await fetchTypeNamesInSpanish(typeNames);
  
      const weight = phisycallData.weight / 10;
      const height = phisycallData.height / 10;
  
      const generation = speciesData.generation.name;
  
      // 5. Hábitat
      let habitatEs = 'Desconocido';
      if (speciesData.habitat) {
        const habitatRes = await fetch(speciesData.habitat.url);
        if (!habitatRes.ok) throw new Error(`habitatRes failed: ${habitatRes.status}`);
        const habitatData = await habitatRes.json();
        habitatEs = getTranslatedName(habitatData);
      }
  
      // 6. Descripción
      const description = await fetchDescription(id);
  
      // 7. Grupos huevo
      const eggGroups = await Promise.all(
        speciesData.egg_groups.map(async (group) => {
          const res = await fetch(group.url);
          if (!res.ok) throw new Error(`egg group failed: ${res.status}`);
          const data = await res.json();
          return getTranslatedName(data);
        })
      );
  
      // 8. Forma
      const shapeRes = await fetch(speciesData.shape.url);
      if (!shapeRes.ok) throw new Error(`shapeRes failed: ${shapeRes.status}`);
      const shapeData = await shapeRes.json();
      const shapeEs = translations.shapeTranslations[shapeData.name] || shapeData.name;
  
      // 9. Color
      const colorRes = await fetch(speciesData.color.url);
      if (!colorRes.ok) throw new Error(`colorRes failed: ${colorRes.status}`);
      const colorData = await colorRes.json();
      const color = translations.colorTranslations[colorData.name] || colorData.name;
  
      const gender = translations.genderTranslations[speciesData.gender_rate.toString()];
      const isLegendaryText = speciesData.is_legendary ? 'Legendario' : ' ';
      const isMythicalText = speciesData.is_mythical ? 'Mítico' : ' ';
      const capture_rate = speciesData.capture_rate;
  
      const growth_rateRes = await fetch(speciesData.growth_rate.url);
      if (!growth_rateRes.ok) throw new Error(`growth_rateRes failed: ${growth_rateRes.status}`);
      const growth_rateData = await growth_rateRes.json();
      const growth_rate = translations.growthTranslations[growth_rateData.name];
  
      const has_gender_differences = speciesData.has_gender_differences ? "Sí" : "No";
  
      const varieties = await Promise.all(
        speciesData.varieties.map(async (entry) => {
          const res = await fetch(entry.pokemon.url);
          if (!res.ok) throw new Error(`variety failed: ${res.status}`);
          const data = await res.json();
          return {
            name: data.name,
            sprite: data.sprites.other['official-artwork'].front_default,
          };
        })
      );
  
      const evoChainRes = await fetch(speciesData.evolution_chain.url);
      if (!evoChainRes.ok) throw new Error(`evoChainRes failed: ${evoChainRes.status}`);
      const evoChainData = await evoChainRes.json();
      const evolutionChain = evoChain(evoChainData.chain);
      const getIdFromUrl = (url) => {
        const match = url.match(/\/pokemon\/(\d+)\//);
        return match ? match[1] : null;
      };
      
      const evoChainWithImages = evolutionChain.map(evo => {
        const id = evo.url ? getIdFromUrl(evo.url) : getIdFromName(evo.name);
        const url = evo.url || (id ? `https://pokeapi.co/api/v2/pokemon/${id}/` : null);
        return {
          ...evo,
          url,  // Asegura que evo tenga url válida para luego usarla sin problemas
          image: id 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            : null
        };
      });
      
      
      
  
      console.log("✅ Datos cargados correctamente para:", p.name);
  
      setSelectedPokemon({
        name: p.name,
        spriteUrl,
        type: typesInSpanish,
        weight,
        height,
        habitatEs,
        description,
        eggGroups,
        shapeEs,
        color,
        gender,
        capture_rate,
        growth_rate,
        has_gender_differences,
        varieties,
        isLegendaryText,
        isMythicalText,
        evoChain: evoChainWithImages,

        generation,
      });
  
    } catch (error) {
      console.error("❌ Error en handleClick:", error);
      alert("Hubo un error cargando los datos de este Pokémon 🐛. ¡Intenta con otro o recarga la página!");
      setSelectedPokemon(null);
    }
  };
  


  // Detectar scroll en el window
  useEffect(() => {
    function handleScroll() {
      // Altura total del documento
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Si estás a menos de 100px del final, carga más
      if (scrollTop + windowHeight >= fullHeight - 100) {
        setVisibleCount(prev => {
          // No pasarse del total
          if (prev >= pokemon.length) return prev;
          return prev + 10;
        });
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pokemon.length]);



  return (
    <>
      <ul className="pkmnList">
        {filteredList.slice(0, visibleCount).map(p => {
          const id = getIdFromUrl(p.url);
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return (
            <li className="pkmn" key={p.name} onClick={() => handleClick(p)}>
              <img className="pkmnSprite" src={spriteUrl} alt={p.name} />
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </li>
          );
        })}
      </ul>
      
      {showButton && (
  <button className="return" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
   <FontAwesomeIcon icon={faArrowUpFromBracket} />
  </button>
)}


      {selectedPokemon && (
        <PokemonModal
          name={selectedPokemon.name}
          translatedNames={translatedNames}
          spriteUrl={selectedPokemon.spriteUrl}
          type={selectedPokemon.type}
          weight={selectedPokemon.weight}
          height={selectedPokemon.height}
          habitat={selectedPokemon.habitatEs}
          description={selectedPokemon.description}
          eggGroups={selectedPokemon.eggGroups}
          shape={selectedPokemon.shapeEs}
          color={selectedPokemon.color}
          gender={selectedPokemon.gender}
          capture_rate={selectedPokemon.capture_rate}
          has_gender_differences={selectedPokemon.has_gender_differences}
          growth_rate={selectedPokemon.growth_rate}
          varieties={selectedPokemon.varieties}
          isLegendary={selectedPokemon.isLegendaryText}
          isMythical={selectedPokemon.isMythicalText}
          evoChain={selectedPokemon.evoChain}
          onClose={() => setSelectedPokemon(null)}
          filteredList={filteredList}
          setSelectedPokemon={setSelectedPokemon}
          handleClickFromParent={handleClick}
        />
      )}
    </>
  );
}

export default PokemonList;


