export interface PokemonData {
  name: string;
  sprite: string;
  cry: string | null;
}

export interface PokemonProps {
  generationNumber?: number;
  pokemonList: { key: number; generationNumber: number }[];
  visible: boolean;
  onClick: (pokemonData: PokemonData) => void;
  currentPokemon: any;
}

export interface ShowBallsProps {
  score: number;
  difficulty: number;
}
