import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalCadastroCliente = ({ open, handleClose, onClienteCadastrado }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleCadastrar = () => {
        const cliente = { nome, telefone };
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        clientes.push(cliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        setNome('');
        setTelefone('');
        handleClose();
        if (onClienteCadastrado) {
            onClienteCadastrado(cliente);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <h1 className='text-3xl'>Cadastrar Cliente</h1>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='flex flex-col'>
                        <p>Nome do cliente</p>
                        <input
                            type="text"
                            className='border-gray-950 bg-slate-200 w-48'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <p>Telefone</p>
                        <input
                            type="text"
                            className='border-gray-950 bg-slate-200 w-48'
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                        <button
                            className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'
                            onClick={handleCadastrar}
                        >
                            Cadastrar
                        </button>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
};

export default ModalCadastroCliente;
