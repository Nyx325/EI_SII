import React from "react";
import { AppView, useAppContext } from "../../state";
import "./Home.css";

export const Home: React.FC = () => {
  const { setAppState } = useAppContext();

  const handlePlay = () => {
    setAppState((prev) => ({
      ...prev,
      view: AppView.SimonGame,
    }));
  };

  const handleGallery = () => {
    setAppState((prev) => ({
      ...prev,
      view: AppView.FigureGallery,
    }));
  };

  return (
    <>
      <title>Figurón</title>
      <div className="home-container">
        <div className="home-background" />
        <nav className="home-nav">
          <ul className="menu-list">
            <li className="menu-item" onClick={handlePlay}>
              Jugar
            </li>
            <li className="menu-item" onClick={handleGallery}>
              Galería de figuras
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
