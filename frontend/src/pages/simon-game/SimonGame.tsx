import React, { useState } from "react";
import { AppView, useAppContext } from "../../state";
import { Whiteboard } from "./WhiteBoard";

enum GameState {
  Idle = "Idle",
  Playing = "Playing",
  GameFinished = "GameFinished",
}

const gameStartButtonText = {
  [GameState.GameFinished]: "Volver a jugar",
  [GameState.Idle]: "Iniciar juego",
  [GameState.Playing]: "",
};

export const SimonGame: React.FC = () => {
  const { setAppState } = useAppContext();
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);

  const handleGoMainMenu = () => {
    setAppState((prev) => ({ ...prev, view: AppView.MainMenu }));
  };

  return (
    <>
      <nav>
        <button onClick={handleGoMainMenu}>Volver</button>
      </nav>

      <section>
        <div>Seccion de escritura</div>
        {gameState !== GameState.Playing && (
          <button>{gameStartButtonText[gameState]}</button>
        )}
      </section>
      <Whiteboard />
    </>
  );
};
