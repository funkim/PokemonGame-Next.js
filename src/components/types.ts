export interface PokemonData {
  name: string;
  sprite: string;
  cry: string | null;
}

export interface PokemonProps {
  generationNumber?: number;
  pokemonData: any;
  visible: boolean;
  onClick: (pokemonData: PokemonData) => void;
}

export interface ShowBallsProps {
  score: number;
  difficulty: number;
}
