import { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [aiGenerated, setAiGenerated] = useState(null);

  const applyAiContent = (data) => {
    setAiGenerated(data);
  };

  const clearAiContent = () => {
    setAiGenerated(null);
  };

  return (
    <PortfolioContext.Provider value={{ aiGenerated, applyAiContent, clearAiContent }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);