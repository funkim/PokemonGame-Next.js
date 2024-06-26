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

  const generations = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    fetchPokemon(difficulty, currentGenIndex);
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
    <>
      <header className="flex flex-col md:flex-row items-center my-12 text-center mb-4 justify-between">
        <div className="flex flex-wrap mx-4 md:mx-20 items-center justify-center gap-5">
          <ShowBalls score={score} difficulty={difficulty} />
          <button
            type="reset"
            onClick={() => resetGameData()}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-col items-center mt-4 md:mt-0">
          <h1 className="text-2xl font-bold mb-5">Pokémon Memory Game</h1>
          <div className="flex space-x-2 mb-4 justify-center">
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
          {win && <h2 className="text-green-600 mt-2 animate-pulse text-5xl">You Win!</h2>}
          {lose && <h2 className="text-red-600 mt-2">You Lost :(</h2>}
        </div>

        <div className="flex flex-wrap mx-4 md:mx-20 items-center justify-center gap-5 mt-4 md:mt-0">
          <div className="flex items-center">
            <button onClick={handlePrevGen} className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200">
              ←
            </button>
            <input
              type="button"
              value={`Generation ${generations[currentGenIndex]}`}
              className="p-2 mx-2 bg-black text-white rounded-lg shadow-md transition-colors duration-200 text-sm"
            />
            <button onClick={handleNextGen} className="p-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200">
              →
            </button>
          </div>
          <button
            onClick={() => getAllGenerations(difficulty, currentGenIndex)}
            className=" flex  px-3 py-1 bg-black text-white rounded-lg shadow-md hover:bg-zinc-600 transition-colors duration-200 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex flex-wrap justify-center items-center my-10 w-screen">
        <div className="flex flex-wrap justify-center gap-8 w-full px-4">
          {pokemonList.map((pokemonData, index) => (
            <div key={index} className="bg-pink-200 hover:bg-red-600 rounded-full p-4">
              {GetPokemon ? <GetPokemon pokemonData={pokemonData} visible={visible} onClick={handlePokemonClick} /> : <p>Loading...</p>}
            </div>
          ))}
        </div>
      </main>
    </>
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
