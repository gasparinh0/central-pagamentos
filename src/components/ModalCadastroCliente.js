import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoIosCloseCircle } from "react-icons/io";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

const formatPhoneNumber = (value) => {
    if (!value) return value;

    // Remove any non-numeric characters
    const phoneNumber = value.replace(/[^\d]/g, '');

    // Format phone number according to (DDD) 99999-9999
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

const ModalCadastroCliente = ({ open, handleClose, onClienteCadastrado }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleCadastrar = () => {
        if (!nome || !telefone) {
            alert('Por favor, coloque as informações necessárias para cadastrar o cliente.');
            return;
        }

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

    const handleTelefoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setTelefone(formattedPhoneNumber);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
                e.preventDefault();
            } else {
                handleCadastrar();
            }
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
                    <div className='flex flex-row justify-between'>
                        <h1 className='text-3xl'>Cadastrar Cliente</h1>
                        <IoIosCloseCircle size="35" onClick={handleClose} style={{ cursor: 'pointer' }} color='#dc2626' />
                    </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form className='flex flex-col'>
                        <p>Nome do cliente</p>
                        <input
                            type="text"
                            className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                            value={nome}
                            placeholder='Digite o nome'
                            onChange={(e) => setNome(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength='50'
                        />
                        <p className='mt-3'>Telefone</p>
                        <input
                            type="text"
                            className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                            value={telefone}
                            placeholder='Digite o telefone'
                            onChange={handleTelefoneChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="button"
                            className='bg-[#e7e7e7] border-green-500 border-2 text-lg p-3 mt-4 h-12 w-56 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-green-500 hover:text-white flex items-center justify-center'
                            onClick={handleCadastrar}
                        >
                            Cadastrar
                        </button>
                    </form>
                </Typography>
            </Box>
        </Modal>
    );
};

export default ModalCadastroCliente;
