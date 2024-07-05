import React, { useState, useEffect } from 'react';
import './App.css'; // Import do CSS
import Tabs from './components/Tabs'; // Imports de componentes
import Welcome from './components/Welcome'; // Corrigido o caminho do import

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Começar o fade-out após 2 segundos

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // Remover o componente após 3 segundos

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="App">
      {showWelcome ? <Welcome fadeOut={fadeOut} /> : <Tabs />}
    </div>
  );
}

export default App;
