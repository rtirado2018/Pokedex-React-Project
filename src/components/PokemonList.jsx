import React, { useEffect, useState } from 'react';
import PokemonModal from './PokemonModal';
import translations from './translationMaps';



import './pokemonList.css';

function PokemonList({ selectedGeneration }) {
  const [pokemon, setPokemon] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [filteredList, setFilteredList] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});
  const visiblePokemon = filteredList.slice(0, visibleCount);

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
    const parts = url.split('/');
    return parts[parts.length - 2];
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

  useEffect(() => {
    const fetchGeneration = async () => {
      if (selectedGeneration === 'all') {
        setFilteredList(pokemon);
        return;
      }
  
      const res = await fetch(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
      const data = await res.json();
      const speciesNames = data.pokemon_species.map(p => p.name);
  
      const filtered = pokemon.filter(p => speciesNames.includes(p.name));
      setFilteredList(filtered);
      setVisibleCount(10); // 👈 reinicia el conteo cuando se filtra
    };
  
    fetchGeneration();
  }, [selectedGeneration, pokemon]);
  


  //LÓGICA DE TRADUCCIÓN

  const getTranslatedName = (data, lang = 'es') => {
    return data.names?.find(n => n.language.name === lang)?.name || data.name || 'Desconocido';
  };

  const handleClick = async (p) => {
    const id = getIdFromUrl(p.url);

    //FETCH GENERAL SPECIES.SPECIES=DATOS ENCICLOPÉDICOS
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesRes.json();


    //FETCH ENDPOINT GENERAL
    const phisycallRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const phisycallData = await phisycallRes.json();

    //IMAGEN ( Viene de repo externa a la API)
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    //TIPO
    const typeNames = phisycallData.types.map(t => t.type.name);
    const typesInSpanish = await fetchTypeNamesInSpanish(typeNames);


    //PESO Y ALTURA (FETCH GENERAL)
    const weight = phisycallData.weight / 10;
    const height = phisycallData.height / 10;

    //GENERACIÓN (Esperando uso para filtro)
    const generation = speciesData.generation.name;


    //SPECIES: HABITAT
    let habitatEs;
    if (speciesData.habitat) {
      const habitatRes = await fetch(speciesData.habitat.url);
      const habitatData = await habitatRes.json();

      habitatEs = getTranslatedName(habitatData);

    } else {
      habitatEs = 'Desconocido';
    }

    //SPECIES: DESCRIPCIÓN
    const description = await fetchDescription(id);



    //SPECIES: EGG_GROUPS

    const eggGroups = await Promise.all(
      speciesData.egg_groups.map(async (group) => {
        const res = await fetch(group.url);
        const data = await res.json();
        return getTranslatedName(data);
      })
    );


    //SPECIES: SHAPE
    const shapeRes = await fetch(speciesData.shape.url);
    const shapeData = await shapeRes.json();
    const shapeEs = translations.shapeTranslations[shapeData.name] || shapeData.name;

    //SPECIES:COLOR
    const colorRes = await fetch(speciesData.color.url);
    const colorData = await colorRes.json();
    const color = translations.colorTranslations[colorData.name] || colorData.name;

    //SPECIES:GENDER_RATE
    const gender_rate = speciesData.gender_rate;

    const gender = translations.genderTranslations[gender_rate.toString()];

    //SPECIES: IS_LEGENDARY
    const isLegendary = speciesData.is_legendary;
    const isLegendaryText = isLegendary ? 'Legendario' : ' ';

    //SPECIES: IS_MYTHICAL
    const isMythical = speciesData.is_mythical;
    const isMythicalText = isMythical ? 'Mítico' : ' ';


    //SPECIES: CAPTURE_RATE
    const capture_rate = speciesData.capture_rate;

    //SPECIES: GROWTH_RATE
    const growth_rateRes = await fetch(speciesData.growth_rate.url);
    const growth_rateData = await growth_rateRes.json();
    const growth_rate = translations.growthTranslations[growth_rateData.name];

    //SPECIES:HAS_GENDER_DIFFERENCES
    const has_gender_differencesRes = speciesData.has_gender_differences;
    const has_gender_differences = has_gender_differencesRes ? "Sí" : "No";

    //SPECIES: VARIETIES
    const varieties = await Promise.all(
      speciesData.varieties.map(async (entry) => {
        const res = await fetch(entry.pokemon.url);
        const data = await res.json();
        return {
          name: data.name,
          sprite: data.sprites.other['official-artwork'].front_default,
        };
      })
    );


    //SPECIES: CADENA EVOLUTIVA

    const getEvolutionChain = (chain) => {
      const evolutions = [];

      let current = chain;

      while (current) {
        const name = current.species.name;

        // Saca el ID del URL de species
        const urlParts = current.species.url.split('/');
        const id = urlParts[urlParts.length - 2];

        // Construye URL del sprite oficial
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        evolutions.push({ name, image });

        // Solo toma la primera evolución (asumimos línea recta)
        current = current.evolves_to[0];
      }

      return evolutions;
    };

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
    const evoChain = getEvolutionChain(evoData.chain);






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
      evoChain,
      generation,

    });
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
        />
      )}
    </>
  );
}

export default PokemonList;


