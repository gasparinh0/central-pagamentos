import React from 'react';

//Imports da logo
import logo from '../assets/logo.png';

//Imports do material UI
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

//Tela de boas vindas
const Welcome = ({ fadeOut }) => {
    return (
        <div className={`flex flex-col items-center justify-center h-screen bg-white transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <img src={logo} alt="Logo" className="w-32 h-32 mb-4" />
            <h1 className="text-2xl font-bold">CENTRAL DO CREDIÁRIO</h1>
            <p className="text-xl">Bem vindo!</p>
            <Box sx={{ display: 'flex', marginTop: '20px' }}>
                <CircularProgress />
            </Box>
        </div>
    );
};

export default Welcome;
