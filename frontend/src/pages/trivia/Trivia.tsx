import React, { useRef, useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard, WhiteBoardRef } from "./WhiteBoard";
import { figures, Figure, getTotalQuestionCount } from "../../data";
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

const matchFigure = (value: number): string | undefined => data[value];

interface Answer {
  index: number;
  figure: Figure;
}

interface Question {
  question: { str: string; answered: boolean };
  answer: Answer;
}

export const SimonGame: React.FC = () => {
  const { setAppState } = useAppContext();
  const [gameState, setGameState] = useState(GameState.Idle);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hitRate, setHitRate] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);

  const [alertMessage, setAlertMessage] = useState<{ message: string; type: AlertType } | undefined>(undefined);
  const whiteboardRef = useRef<WhiteBoardRef>(null);

  const totalQuestions = getTotalQuestionCount();

  const handleGoMainMenu = () => setAppState(prev => ({ ...prev, view: AppView.MainMenu }));

  // returns a random unanswered question or undefined if none left
  const getRandomQuestion = (): Question | undefined => {
    const allItems: Question[] = [];
    figures.forEach((figure, fi) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      figure.questions.forEach((q, _qi) => {
        if (!q.answered) {
          allItems.push({ question: q, answer: { index: fi, figure } });
        }
      });
    });

    if (allItems.length === 0) {
      return undefined;
    }

    const pick = randomIntFromInterval(0, allItems.length - 1);
    return allItems[pick];
  };

  const startGame = () => {
    // reset all state & data
    figures.forEach(fig => fig.questions.forEach(q => (q.answered = false)));
    setHits(0);
    setErrors(0);
    setAnsweredQuestions(0);
    setHitRate(0);
    setAlertMessage(undefined);
    setGameState(GameState.Playing);

    const firstQ = getRandomQuestion();
    if (firstQ) setCurrentQuestion(firstQ);
  };

  const endGame = () => {
    setAlertMessage(undefined);
    setGameState(GameState.ShowingResults);
    const ratio = (hits * 100) / (hits + errors);
    setHitRate(Number.isNaN(ratio) ? 0 : ratio);
  };

  const handleChangeGameState = () => {
    if (gameState === GameState.Idle || gameState === GameState.ShowingResults) {
      startGame();
    } else {
      endGame();
    }
  };

  const handleSendCanvas = () => {
    if (!currentQuestion) return;
    setAlertMessage(undefined);

    const image = whiteboardRef.current?.getCanvasDataUrl();

    fetch("http://127.0.0.1:5000/opencv", {
      method: "POST",
      body: JSON.stringify({ image }),
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al procesar la imagen");
        return response.json();
      })
      .then(({ figure }) => {
        const userIdx = Number(figure);
        const correctIdx = currentQuestion.answer.index;

        if (userIdx === correctIdx) {
          setAlertMessage({ message: "¡Correcto!", type: AlertType.SUCCESS });
          setHits(prev => prev + 1);
        } else {
          setAlertMessage({ message: `¡Casi! la respuesta era: ${matchFigure(correctIdx)}`, type: AlertType.WARNING });
          setErrors(prev => prev + 1);
        }

        // mark answered
        currentQuestion.question.answered = true;
        const nextCount = answeredQuestions + 1;
        setAnsweredQuestions(nextCount);

        setTimeout(() => {
          setAlertMessage(undefined);
          // if no more questions, end game
          if (nextCount >= totalQuestions) {
            endGame();
          } else {
            const nextQ = getRandomQuestion();
            if (nextQ) setCurrentQuestion(nextQ);
          }
        }, 3000);
      })
      .catch(() => {
        setAlertMessage({ message: "Error al procesar la imagen", type: AlertType.DANGER });
      });
  };

  return (
    <>
      <nav>
        <button onClick={handleGoMainMenu}>Volver</button>
        <button onClick={handleChangeGameState}>{startGameBtnLegend[gameState]}</button>
      </nav>

      <article>
        {gameState === GameState.Playing && currentQuestion ? (
          <h2>{currentQuestion.question.str}</h2>
        ) : (
          <h2>¿Has estudiado?</h2>
        )}
        {alertMessage && <Alert message={alertMessage.message} type={alertMessage.type} />}
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

      {gameState === GameState.Playing && <button onClick={handleSendCanvas}>Enviar</button>}
    </>
  );
};
