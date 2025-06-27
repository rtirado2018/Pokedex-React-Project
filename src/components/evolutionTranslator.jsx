import evoItemsTranslations from "./translationMaps"; // o evolutionTranslator


export function traducirMetodoEvolucion(evo) {
function traducirMetodoEvolucion(evo) {
    if (!evo) return "";
  
    // Si el método está dentro de evolution_details
    const details = evo.evolution_details && evo.evolution_details[0];
    if (!details) return "";
  
    const triggerTraducido = {
      "level-up": "Subir de nivel",
      "trade": "Intercambio",
      "use-item": "Uso de objeto",
      "shed": "Evolución por muda",
      "other": "Otro método",
    };
  
    const trigger = triggerTraducido[details.trigger] || details.trigger;
  
    if (details.min_level) {
      return `${trigger} al nivel ${details.min_level}`;
    }
    if (details.item) {
      return `${trigger} usando ${details.item.name || details.item}`;
    }
    if (details.held_item) {
      return `${trigger} sosteniendo ${details.held_item.name || details.held_item}`;
    }
    if (details.known_move_type) {
      return `${trigger} con movimiento de tipo ${details.known_move_type.name || details.known_move_type}`;
    }
    if (details.known_move) {
      return `${trigger} con movimiento ${details.known_move.name || details.known_move}`;
    }
    if (details.time_of_day) {
      return `${trigger} durante el ${details.time_of_day}`;
    }
    if (details.location) {
      return `${trigger} en ${details.location.name || details.location}`;
    }
  
    return trigger;
  }

}
  
