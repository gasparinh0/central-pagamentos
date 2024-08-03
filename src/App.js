import React, { useState, useEffect } from 'react';
import './App.css'; // Import do CSS
import Tabs from './components/Tabs'; // Imports de componentes
import Welcome from './components/Welcome'; // Corrigido o caminho do import
import { ToastContainer } from 'react-toastify'; //Imports do react-toastify
import { isMobile } from 'react-device-detect'; // Import do react-device-detect
import { IoAlertCircle } from "react-icons/io5";

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

    <div>
      {isMobile ? (
        <div className='flex justify-center items-center flex-col w-full min-h-screen text-center p-4 text-neutral-700'>
          <IoAlertCircle size='45'/>
          <h1>Esse site não é compatível com aparelhos celulares, por favor, acesse pelo computador.</h1>
        </div>
      ) : (
        <div>
          <div className="App">
            <ToastContainer />
            {showWelcome ? <Welcome fadeOut={fadeOut} /> : <Tabs />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
