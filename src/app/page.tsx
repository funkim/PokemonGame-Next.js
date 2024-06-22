'use client';
import React, { useEffect, useState } from 'react';
import GetPokemon from '@/components/GetPokemon';
import ShowBalls from '@/components/ShowBalls';
import { PokemonData } from '@/components/types';
import { getAllPokemon, getGenerationalPokemon } from '@/components/pokemonCatching';

export default function App() {
  const [difficulty, setDifficulty] = useState(6);
  const [score, setScore] = useState(0);
  const [clickedPokemon, setClickedPokemon] = useState<PokemonData[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [visible, setVisible] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [currentGenIndex, setCurrentGenIndex] = useState(1);

  const generations = [1, 2, 3, 4, 5, 6, 7];

  async function fetchPokemon(diff = difficulty, gen = currentGenIndex) {
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
  }, [difficulty, currentGenIndex]);

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

  function changeDifficulty(diff: number, gen: number) {
    resetGameData();
    setDifficulty(diff);
    fetchPokemon(diff, gen);
  }

  function getAllGenerations(diff: number, gen: number) {
    resetGameData();
    setCurrentGenIndex(0);
    fetchPokemon(diff, gen);
  }

  function handleNextGen() {
    setCurrentGenIndex((prevIndex) => (prevIndex + 1) % generations.length);
  }

  function handlePrevGen() {
    setCurrentGenIndex((prevIndex) => (prevIndex - 1 + generations.length) % generations.length);
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4  ">
      <header className="flex flex-col items-center w-full max-w-md text-center mb-4">
        <h1 className="text-xl font-bold mb-2">Pokémon Memory Game</h1>
        <div className="flex items-center justify-center mb-2">
          <span className="text-lg">
            Score: {score} / {difficulty}
          </span>
        </div>
        <ShowBalls score={score} difficulty={difficulty} />
        <button
          onClick={() => changeDifficulty(difficulty, currentGenIndex)}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 text-sm"
        >
          Restart
        </button>
        <button
          onClick={() => getAllGenerations(difficulty, currentGenIndex)}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 text-sm"
        >
          Everyone!
        </button>

        {win && <h2 className="text-green-600 mt-2  animate-pulse">You Win!</h2>}
        {lose && <h2 className="text-red-600 mt-2">You Lost :(</h2>}
      </header>

      <div className="flex items-center justify-center mb-2">
        <button
          onClick={handlePrevGen}
          className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200 hover:backdrop-blur-xl"
        >
          ←
        </button>
        <input
          type="button"
          value={`Generation ${generations[currentGenIndex]}`}
          className="p-2 mx-2 bg-black text-white rounded-lg shadow-md  transition-colors duration-200 text-sm "
        />
        <button onClick={handleNextGen} className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200">
          →
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        {[3, 6, 10].map((diff) => (
          <button
            key={diff}
            onClick={() => changeDifficulty(diff, currentGenIndex)}
            className={`px-3 py-1 rounded-lg shadow-md transition-colors duration-200 text-sm ${
              diff === difficulty ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            } hover:bg-blue-600 hover:text-white`}
          >
            {diff === 3 ? 'Easy' : diff === 6 ? 'Normal' : 'Hard'}
          </button>
        ))}
      </div>

      <main className="">
        <div className="flex flex-wrap justify-center gap-8">
          {pokemonList.map((pokemonData, index) => (
            <GetPokemon key={index} pokemonData={pokemonData} visible={visible} onClick={handlePokemonClick} />
          ))}
        </div>
      </main>
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
