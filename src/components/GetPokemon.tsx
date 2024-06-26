'use client';
import { useRef } from 'react';
import { PokemonProps } from './types';

export default function GetPokemon({ pokemonData, visible, onClick }: PokemonProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handlePokemonClick() {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    }
    if (onClick && pokemonData) {
      onClick(pokemonData);
    }
  }

  return (
    <>
      {visible ? (
        <div className="rounded-full w-80 bg-red-300 justify-center flex">
          <img
            src={pokemonData.sprite}
            alt="Pokemon Sprite"
            onClick={handlePokemonClick}
            className="hover:drop-shadow-lg hover:scale-110 cursor-pointer"
          />
        </div>
      ) : (
        <div className="w-80">
          <img src="https://pngfre.com/wp-content/uploads/Pokeball-1.png" alt="Empty Pokemon Sprite" className="" />
        </div>
      )}
      {pokemonData.cry && <audio ref={audioRef} src={pokemonData.cry} />}
    </>
  );
}
