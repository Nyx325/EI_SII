import React, { useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard } from "./WhiteBoard";
import { figures } from "../../data";
import { randomIntFromInterval } from "../../etc/randomInt";

enum ViewState {
  Idle = "Idle",
  Playing = "Playing",
  GameFinished = "GameFinished",
}

enum GameState {
  ShowingPattern,
  Drawing,
  Finish,
}

const gameStartButtonText = {
  [ViewState.GameFinished]: "Volver a jugar",
  [ViewState.Idle]: "Iniciar juego",
  [ViewState.Playing]: "",
};

interface FigureList {
  figureIndexes: number[];
  currFigure?: number;
}

const getRandomIndex = () => randomIntFromInterval(0, figures.length - 1);

export const SimonGame: React.FC = () => {
  const { setAppState } = useAppContext();
  const [viewState, setViewState] = useState<ViewState>(ViewState.Idle);
  const [figuresList, setFiguresList] = useState<FigureList>({
    figureIndexes: [],
  });
  const [figuresDrawed, setFiguresDrawed] = useState<number>(0);

  const handleGoMainMenu = () => {
    setAppState((prev) => ({ ...prev, view: AppView.MainMenu }));
  };

  return (
    <>
      <section>
        <article>
          {figuresList.currFigure
            ? figures[figuresList.currFigure].name
            : "¿Quieres jugar un juego?"}
        </article>
        <div>
          <button onClick={handleGoMainMenu}>Volver</button>
          {viewState !== ViewState.Playing && (
            <button>{gameStartButtonText[viewState]}</button>
          )}
        </div>
      </section>
      <Whiteboard />
    </>
  );
};
