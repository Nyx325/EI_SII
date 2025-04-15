import { createContext, useContext, useState } from "react";

export enum AppView {
  MainMenu = "MainMenu",
  SimonGame = "SimonGame",
  FigureGallery = "FigureGallery",
}

interface AppState {
  view: AppView;
}

interface AppContextProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

type Provider = {children: React.ReactNode};
export const AppProvider: React.FC<Provider> = ({children}) => {
  const [appState, setAppState] = useState<AppState>({
    view: AppView.MainMenu
  })

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if(!context) throw new Error("useAppContext debe usarse dentro de un AppProvider")
  return context;
}
