'use client';
import React, { useEffect, useState } from 'react';
import GetPokemon from '@/components/GetPokemon';
import ShowBalls from '@/components/ShowBalls';
import { PokemonData } from '@/components/types';
import { getAllPokemon, getGenerationalPokemon } from '@/components/pokemonCatching';

export default function App() {
  const [generation, setGeneration] = useState(0);
  const [difficulty, setDifficulty] = useState(6);
  const [score, setScore] = useState(0);
  const [clickedPokemon, setClickedPokemon] = useState<PokemonData[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [visible, setVisible] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  async function fetchPokemon(diff = difficulty, gen = generation) {
    let initialPokemon: PokemonData[] = [];
    if (gen && gen > 0) {
      for (let i = 0; i < diff; i++) {
        const newPokemon = await getGenerationalPokemon(
          gen,
          initialPokemon.map((p) => p.name)
        );
        initialPokemon.push(newPokemon);
      }
    } else {
      for (let i = 0; i < diff; i++) {
        const newPokemon = await getAllPokemon(initialPokemon.map((p) => p.name));
        initialPokemon.push(newPokemon);
      }
    }
    setPokemonList(initialPokemon);
  }

  useEffect(() => {
    fetchPokemon();
  }, [difficulty, generation]);

  function winHandler() {
    setWin(true);
    setClickedPokemon([]);
  }

  function lostHandler() {
    setScore(0);
    setLose(true);
    setClickedPokemon([]);
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

    setVisible(false);
    setTimeout(() => {
      const shuffledList = Shuffle([...pokemonList]);
      setPokemonList(shuffledList);
      setVisible(true);
    }, 1800);
  }

  function resetGameData() {
    setClickedPokemon([]);
    setPokemonList([]);
    setWin(false);
    setLose(false);
    setScore(0);
    setVisible(true);
  }

  function handleGenerationClick(gen: number) {
    resetGameData();
    setGeneration(gen);
    fetchPokemon(difficulty, gen);
  }

  function changeDifficulty(diff: number) {
    setDifficulty(diff);
    resetGameData();
    fetchPokemon(diff, generation);
  }

  return (
    <div className="">
      <div className="">
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
      <div className="">
        {[1, 2, 3, 4, 5, 6, 7].map((gen) => (
          <input key={gen} type="button" onClick={() => handleGenerationClick(gen)} value={`Generation ${gen}`} />
        ))}
      </div>
      <div className="">
        {[3, 6, 10].map((diff) => (
          <input key={diff} type="button" onClick={() => changeDifficulty(diff)} value={diff === 3 ? 'Easy' : diff === 6 ? 'Normal' : 'Hard'} />
        ))}
      </div>
      <div className="ccolor-bg">
        {pokemonList.map((pokemonData, index) => (
          <GetPokemon key={index} pokemonData={pokemonData} visible={visible} onClick={handlePokemonClick} />
        ))}
      </div>
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
