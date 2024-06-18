"use client";
import { useRef } from "react";
import { PokemonProps } from "./types";

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

  if (!pokemonData)
    return (
      <div>
        <p>Loading... </p>
      </div>
    );

  return (
    <div>
      {visible ? (
        <img src={pokemonData.sprite} alt="Pokemon Sprite" onClick={handlePokemonClick} />
      ) : (
        <img src="https://pngfre.com/wp-content/uploads/Pokeball-1.png" alt="Empty Pokemon Sprite" className="empty" />
      )}
      {pokemonData.cry && <audio ref={audioRef} src={pokemonData.cry} />}
    </div>
  );
}
