import React from "react";
import "./App.css";
import { Home, SimonGame, Gallery } from "./pages";
import { AppView, AppProvider, useAppContext } from "./state";

const renderView = {
  [AppView.MainMenu]: <Home />,
  [AppView.FigureGallery]: <Gallery />,
  [AppView.SimonGame]: <SimonGame />,
};

const AppContent: React.FC = () => {
  const { appState } = useAppContext();

  return (
    <>
      <main>{renderView[appState.view]}</main>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
