import React from "react";
import "./Gallery.css";
import { Figure } from "./Figure";
import { figuresInfo } from "../../data";
import { AppView, useAppContext } from "../../state";

export const Gallery: React.FC = () => {
  const { setAppState } = useAppContext();

  const handleMainMenu = () => {
    setAppState((prev) => ({ ...prev, view: AppView.MainMenu }));
  };

  const handlePlay = () => {
    setAppState((prev) => ({ ...prev, view: AppView.SimonGame }));
  };

  return (
    <>
      <header className="encabezado">
        <h1>Explorando Figuras Geométricas</h1>
        <p>Descubre el poder de las formas, ¡A darle!</p>
        <button onClick={handleMainMenu}>Volver</button>
      </header>
      {figuresInfo.map(
        ({
          id,
          name,
          description,
          funFacts,
          figureImage,
          motivationalPhrase,
          formulas,
        }) => {
          return (
            <Figure
              id={id}
              name={name}
              description={description}
              funFacts={funFacts}
              figureImage={figureImage}
              motivationalPhrase={motivationalPhrase}
              formulas={formulas}
            />
          );
        },
      )}

      <button className="boton-jugar" onClick={handlePlay}>
        ¡Estoy listo para jugar!
      </button>
    </>
  );
};
