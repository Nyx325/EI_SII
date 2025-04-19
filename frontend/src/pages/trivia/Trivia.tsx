import React, { useRef, useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard, WhiteBoardRef } from "./WhiteBoard";
import { figures, Figure } from "../../data";
import { randomIntFromInterval } from "../../etc/randomInt";
import Alert, { AlertType } from "../../components/Alert";

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

const data: Record<number, string> = {
  0: "Corazón",
  1: "Cuadrado",
  2: "Pentágono",
  3: "Rombo",
  4: "Triángulo",
};

const matchFigure = (value: number): string | undefined => {
  return data[value];
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
  const [alertMessage, setAlertMessage] = useState<
    { message: string; type: AlertType } | undefined
  >(undefined);
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
    setAlertMessage(undefined);
    setGameState(GameState.Playing);
    const question = getRandomQuestion();
    setCurrentQuestion(question);
  };

  const endGame = () => {
    setAlertMessage(undefined);
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
    setAlertMessage(undefined);

    const image = whiteboardRef.current?.getCanvasDataUrl();

    fetch("http://127.0.0.1:5000/opencv", {
      method: "POST",
      body: JSON.stringify({ image }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Ocurrió un error al procesar la imagen");
        }
        return response.json();
      })
      .then((response) => {
        const figure = Number(response.figure);
        const correctFigure = currentQuestion?.answer.index;
        console.log(matchFigure(figure));
        console.log(
          `Respuesta dada: ${matchFigure(figure)} Respuesta correcta: ${matchFigure(correctFigure ?? 20)}`,
        );

        if (figure === correctFigure) {
          setAlertMessage({
            message: "¡Correcto!",
            type: AlertType.SUCCESS,
          });

          setHits(hits + 1);
        } else {
          setAlertMessage({
            message: `¡Casi! la respuesta era: ${matchFigure(correctFigure as number)}`,
            type: AlertType.WARNING,
          });

          setErrors(errors + 1);
        }

        setTimeout(() => {
          setAlertMessage(undefined);
          const question = getRandomQuestion();
          setCurrentQuestion(question);
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
        setAlertMessage({
          message: "Error al procesar la imagen",
          type: AlertType.DANGER,
        });
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
        {currentQuestion && gameState === GameState.Playing ? (
          <h2>{currentQuestion.question}</h2>
        ) : (
          <h2>¿Has estudiado?</h2>
        )}
        {alertMessage && (
          <Alert message={alertMessage.message} type={alertMessage.type} />
        )}
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
      </section>
      {gameState === GameState.Playing && (
        <button onClick={handleSendCanvas}>Enviar</button>
      )}
    </>
  );
};
