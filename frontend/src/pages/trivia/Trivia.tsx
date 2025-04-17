import React, { useRef, useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard, WhiteBoardRef } from "./WhiteBoard";
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

interface Answer {
  index: number;
  figure: Figure;
}

interface Question {
  question: string;
  answer: Answer;
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
  const whiteboardRef = useRef<WhiteBoardRef>(null);

  const handleGoMainMenu = () => {
    setAppState((prev) => ({ ...prev, view: AppView.MainMenu }));
  };

  const getRandomQuestion = (): Question => {
    const figureIndex = randomIntFromInterval(0, figures.length - 1);
    const figure = figures[figureIndex];

    const questionIndex = randomIntFromInterval(0, figure.questions.length - 1);
    const question = figure.questions[questionIndex];

    return {
      question,
      answer: {
        index: figureIndex,
        figure,
      },
    };
  };

  const startGame = () => {
    setGameState(GameState.Playing);
    const question = getRandomQuestion();
    setCurrentQuestion(question);
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

  const handleSendCanvas = () => {
    const imageData = whiteboardRef.current?.getCanvasDataUrl();

    fetch("http://127.0.0.1:5000/opencv", {
      method: "POST",
      body: JSON.stringify({ image: imageData }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      console.log("Procesao");
    });
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
      <section>
        <Whiteboard drawColor="#fff" boardColor="#000" ref={whiteboardRef} />
        {gameState === GameState.Playing && (
          <button onClick={handleSendCanvas}>Enviar</button>
        )}
      </section>
    </>
  );
};
