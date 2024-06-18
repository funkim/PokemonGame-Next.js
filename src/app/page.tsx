"use client";
import React, { useEffect, useState } from "react";
import GetPokemon from "@/components/GetPokemon";
import ShowBalls from "@/components/ShowBalls";
import { PokemonData } from "@/components/types";
import { getAllPokemon, getGenerationalPokemon } from "@/components/pokemonCatching";

export default function App() {
  const [generation, setGeneration] = useState(0);
  const [difficulty, setDifficulty] = useState(6);
  const [score, setScore] = useState(0);
  const [clickedPokemon, setClickedPokemon] = useState<PokemonData[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [visible, setVisible] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  useEffect(() => {
    async function fetchInitialPokemon() {
      let initialPokemon: PokemonData[] = [];
      if (generation && generation > 0) {
        for (let i = 0; i < difficulty; i++) {
          const newPokemon = await getGenerationalPokemon(
            generation,
            initialPokemon.map((p) => p.name)
          );
          initialPokemon.push(newPokemon);
        }
      } else {
        for (let i = 0; i < difficulty; i++) {
          const newPokemon = await getAllPokemon(initialPokemon.map((p) => p.name));
          initialPokemon.push(newPokemon);
        }
      }
      setPokemonList(initialPokemon);
    }

    fetchInitialPokemon();
  }, [generation, difficulty]);

  function winHandler() {
    setWin(true);
  }

  function lostHandler() {
    setScore(0);
    setWin(false);
    setLose(true);
    resetGameData();
  }

  function handlePokemonClick(pokemonData: PokemonData) {
    if (clickedPokemon.some((pokemon) => pokemon.name === pokemonData.name)) {
      lostHandler();
    } else {
      setLose(false);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === difficulty) {
        winHandler();
      }
    }

    setClickedPokemon([...clickedPokemon, pokemonData]);

    // hide pokemon shuffle list then show them again

    setVisible(false);
    setTimeout(() => {
      const shuffledList = Shuffle([...pokemonList]);
      setPokemonList(shuffledList);
      setVisible(true);
    }, 1000);
  }

  function resetGameData() {
    setClickedPokemon([]);
    setWin(false);
    setLose(false);
    setScore(0);
    setVisible(true);
  }

  function handleGenerationClick(gen: number) {
    setGeneration(gen);
    resetGameData();
  }

  function changeDifficulty(diff: number) {
    setDifficulty(diff);
    resetGameData();
  }

  return (
    <div className="container">
      <div className="gamestate">
        <h2>
          Score: {score} / {difficulty}
        </h2>
        <ShowBalls score={score} difficulty={difficulty} />
        <input type="button" id="restart" onClick={resetGameData} value="Restart?" />
        {win && <h2>You Win!</h2>}
        {lose && <h2>You Lost!</h2>}
      </div>
      <div className="all">
        <input type="button" onClick={() => handleGenerationClick(0)} value="Everyone!" />
      </div>
      <div className="generations">
        {[1, 2, 3, 4, 5, 6, 7].map((gen) => (
          <input key={gen} type="button" onClick={() => handleGenerationClick(gen)} value={`Generation ${gen}`} />
        ))}
      </div>
      <div className="difficulties">
        {[3, 6, 10].map((diff) => (
          <input key={diff} type="button" onClick={() => changeDifficulty(diff)} value={diff === 3 ? "Easy" : diff === 6 ? "Normal" : "Hard"} />
        ))}
      </div>
      {pokemonList.map((pokemonData, index) => (
        <GetPokemon key={index} pokemonData={pokemonData} visible={visible} onClick={handlePokemonClick} />
      ))}
    </div>
  );
}

function Shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
