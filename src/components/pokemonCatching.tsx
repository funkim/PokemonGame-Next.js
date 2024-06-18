import { PokemonData } from "./types";

export async function getGenerationalPokemon(generation: number, currentPokemon: string[]): Promise<PokemonData> {
  const fetchGeneration = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
  const generationData: any = await fetchGeneration.json();

  const allGenerationPokemon = generationData.pokemon_species;
  const randomPokemonNumber = allGenerationPokemon[Math.floor(Math.random() * allGenerationPokemon.length)];
  const pokemonName = randomPokemonNumber.name;

  if (!currentPokemon.includes(pokemonName)) {
    const fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
    const thisPokemonData = await fetchPokemon.json();
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
    // Handle edge case to prevent infinite recursion
    if (currentPokemon.length >= allGenerationPokemon.length) {
      throw new Error("All Pokémon in this generation have been fetched.");
    }
    return getGenerationalPokemon(generation, currentPokemon);
  }
}

export async function getAllPokemon(currentPokemon: string[]): Promise<PokemonData> {
  const fetchAllPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
  const allPokemonData: any = await fetchAllPokemon.json();
  const allPokemon = allPokemonData.results;

  const randomPokemonNumber = allPokemon[Math.floor(Math.random() * allPokemon.length)];
  const pokemonName = randomPokemonNumber.name;

  if (!currentPokemon.includes(pokemonName)) {
    const fetchPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
    const thisPokemonData = await fetchPokemon.json();
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
    // Handle edge case to prevent infinite recursion
    if (currentPokemon.length >= allPokemon.length) {
      throw new Error("All Pokémon have been fetched.");
    }
    return getAllPokemon(currentPokemon);
  }
}
