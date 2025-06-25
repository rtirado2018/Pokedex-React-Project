

export const evoChain = (chain) => {
    const evolutions = [];
  
    const parseStage = (node, fromName = null) => {
      const { species, evolves_to, evolution_details } = node;
  
      const id = species.url.split('/').at(-2);
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      console.log("✨✨ EvolutionUtils cargado ✨✨");

  
      let detailsText = "_";
      if (evolution_details.length > 0) {
        const evo = evolution_details[0];
        if (evo.min_level) {
          detailsText = `Nivel ${evo.min_level}`;
        } else if (evo.item) {
          detailsText = `Usar ${evo.item.name}`;
        } else if (evo.trigger.name === "trade") {
          detailsText = evo.held_item
            ? `Intercambio con ${evo.held_item.name}`
            : `Intercambio`;
        } else {
          detailsText = evo.trigger.name;
        }
      }
  
      evolutions.push({
        name: species.name,
        image,
        from: fromName,
        method: detailsText
      });
  
      if (evolves_to.length > 0) {
        evolves_to.forEach(evo => parseStage(evo, species.name));
      }
    };
  
    parseStage(chain);
    return evolutions;
    
  };
  