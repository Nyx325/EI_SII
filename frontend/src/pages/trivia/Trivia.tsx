import React, { useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard } from "./WhiteBoard";
import { figures, Figure } from "../../data";
import { randomIntFromInterval } from "../../etc/randomInt";

enum GameState {
  Idle = "Idle",
  Playing = "Playing",
  ShowingResults = "ShowingResults",
}

const startGameBtnLegend = {
  [GameState.Idle]: "Iniciar juego",
  [GameState.Playing]: "Finalizar juego",
  [GameState.ShowingResults]: "Volver a jugar",
};

interface Question {
  question: string;
  answer: Figure;
}

export const SimonGame: React.FC = () => {
  const { setAppState } = useAppContext();
  const [gameState, setGameState] = useState(GameState.Idle);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hitRate, setHitRate] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined,
  );

  const handleGoMainMenu = () => {
    setAppState((prev) => ({ ...prev, view: AppView.MainMenu }));
  };

  const getRandomQuestion = (): [string, Figure] => {
    const figureIndex = randomIntFromInterval(0, figures.length - 1);
    const figure = figures[figureIndex];

    const questionIndex = randomIntFromInterval(0, figure.questions.length - 1);
    const question = figure.questions[questionIndex];

    return [question, figure];
  };

  const startGame = () => {
    setGameState(GameState.Playing);
    const [question, answer] = getRandomQuestion();
    setCurrentQuestion({
      question,
      answer,
    });
  };

  const endGame = () => {
    setGameState(GameState.ShowingResults);
    const ratio = (hits * 100) / (hits + errors);
    setHitRate(Number.isNaN(ratio) ? 0 : ratio);
  };

  const handleChangeGameState = () => {
    const nextState = {
      [GameState.Idle]: startGame,
      [GameState.Playing]: endGame,
      [GameState.ShowingResults]: startGame,
    };

    nextState[gameState]();
  };

  return (
    <>
      <nav>
        <button onClick={handleGoMainMenu}>Volver</button>
        <button onClick={handleChangeGameState}>
          {startGameBtnLegend[gameState]}
        </button>
      </nav>
      <article>
        {currentQuestion ? currentQuestion.question : "¿Has estudiado?"}
      </article>
      {gameState === GameState.Playing && (
        <section>
          <article>Aciertos: {hits}</article>
          <article>Desaciertos: {errors}</article>
        </section>
      )}
      {gameState === GameState.ShowingResults && (
        <section>
          <article>Juego finalizado</article>
          <article>Tasa de aciertos: {hitRate.toFixed(2)}%</article>
        </section>
      )}
      <Whiteboard drawColor="#fff" boardColor="#000" />
    </>
  );
};
