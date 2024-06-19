import { PokemonData } from "./types";

async function fetchWithRetry(url: string, retries: number = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      return await response.json();
    } catch (error: any) {
      console.error(`Fetch attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
    }
  }
}

export async function getGenerationalPokemon(generation: number, currentPokemon: string[]): Promise<PokemonData> {
  try {
    const generationData = await fetchWithRetry(`https://pokeapi.co/api/v2/generation/${generation}/`);
    const allGenerationPokemon = generationData.pokemon_species;
    const randomPokemonNumber = allGenerationPokemon[Math.floor(Math.random() * allGenerationPokemon.length)];
    const pokemonName = randomPokemonNumber.name;

    if (!currentPokemon.includes(pokemonName)) {
      const thisPokemonData = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
      const pokemonSprite = thisPokemonData.sprites.other["official-artwork"].front_default
        ? thisPokemonData.sprites.other["official-artwork"].front_default
        : thisPokemonData.sprites.front_default;
      const pokemonCry = thisPokemonData.cries?.latest || null;

      return {
        name: pokemonName,
        sprite: pokemonSprite,
        cry: pokemonCry,
      };
    } else {
      return getGenerationalPokemon(generation, currentPokemon);
    }
  } catch (error: any) {
    console.error(`Failed to fetch generational Pokémon: ${error.message}`);
    return getGenerationalPokemon(generation, currentPokemon);
  }
}

export async function getAllPokemon(currentPokemon: string[]): Promise<PokemonData> {
  try {
    const allPokemonData = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const allPokemon = allPokemonData.results;
    const randomPokemonNumber = allPokemon[Math.floor(Math.random() * allPokemon.length)];
    const pokemonName = randomPokemonNumber.name;

    if (!currentPokemon.includes(pokemonName)) {
      const thisPokemonData = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
      const pokemonSprite = thisPokemonData.sprites.other["official-artwork"].front_default
        ? thisPokemonData.sprites.other["official-artwork"].front_default
        : thisPokemonData.sprites.front_default;
      const pokemonCry = thisPokemonData.cries?.latest || null;

      return {
        name: pokemonName,
        sprite: pokemonSprite,
        cry: pokemonCry,
      };
    } else {
      return getAllPokemon(currentPokemon);
    }
  } catch (error: any) {
    console.error(`Failed to fetch Pokémon: ${error.message}`);
    return getAllPokemon(currentPokemon);
  }
}
