import * as React from 'react';
import { useState, useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { formatToPhone } from 'brazilian-values';

const ListaClientes = ({ clientes, onDelete, onEdit }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [colors, setColors] = useState({});
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState(clientes);
    const [isAlphabetical, setIsAlphabetical] = useState(false);

    useEffect(() => {
        // Generate a color for each client name
        const newColors = {};
        clientes.forEach(cliente => {
            if (!colors[cliente.nome]) {
                newColors[cliente.nome] = stringToColor(cliente.nome);
            }
        });
        setColors(prevColors => ({ ...prevColors, ...newColors }));
    }, [clientes]);

    useEffect(() => {
        let displayedClientes = clientes;
        if (searchTerm !== '') {
            displayedClientes = displayedClientes.filter(cliente =>
                cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (isAlphabetical) {
            displayedClientes = [...displayedClientes].sort((a, b) => 
                a.nome.localeCompare(b.nome)
            );
        }
        setFilteredClientes(displayedClientes);
    }, [searchTerm, isAlphabetical, clientes]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSwitchChange = (event) => {
        setIsAlphabetical(event.target.checked);
    };

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditNome(clientes[index].nome);
        setEditTelefone(clientes[index].telefone);
    };

    const handleSaveEdit = () => {
        onEdit(editIndex, { nome: editNome, telefone: editTelefone });
        setEditIndex(null);
        setEditNome('');
        setEditTelefone('');
    };

    const handleEditTelefoneChange = (e) => {
        setEditTelefone(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
                e.preventDefault();
            } else {
                handleSaveEdit();
            }
        }
    };

    if (clientes.length === 0) {
        return <div className='flex justify-center items-center text-2xl mt-9'>Nenhum cliente encontrado.</div>;
    }

    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name, size = 56) {
        const nameParts = name.split(' ');

        let initials = nameParts[0][0];
        if (nameParts.length >= 2) {
            initials += nameParts[1][0];
        }

        return {
            sx: {
                bgcolor: colors[name] || stringToColor(name),
                width: size,
                height: size,
                color: '#fff',
                fontSize: size / 2,
            },
            children: initials,
        };
    }

    const toggleConfirmacaoExclusao = (index) => {
        setConfirmacaoExclusao((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const cancelarExclusao = () => {
        setConfirmacaoExclusao({});
    };

    return (
        <div>
            <div className='flex flex-row justify-between'>
                <input
                    type="text"
                    className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                    placeholder='Pesquisar'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MdFilterAlt size='40'/> Filtros
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>
                        <Switch {...label} checked={isAlphabetical} onChange={handleSwitchChange} /> Ordem alfabética
                    </MenuItem>
                </Menu>
            </div>
            <ul>
                {filteredClientes.length > 0 ? (
                    filteredClientes.map((cliente, index) => (
                        <li key={index}>
                            <div>
                                <div className='flex bg-[#e5e7eb] p-7 rounded-3xl gap-y-4 mt-5'>
                                    <div className='mr-3'>
                                        <Avatar {...stringAvatar(cliente.nome, 70)} />
                                    </div>
                                    <div>
                                        <h1 className='text-3xl'>{cliente.nome}</h1>
                                        <div className='flex space-x-2'>
                                            <p className='text-2xl'>Telefone:</p>
                                            <p className='text-2xl font-light'>{cliente.telefone}</p>
                                        </div>
                                    </div>
                                    <div className='flex ml-auto space-x-6'>
                                        {!confirmacaoExclusao[index] && (
                                            <button
                                                className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center"
                                                onClick={() => handleEdit(index)}
                                            >
                                                <MdModeEdit className="mr-2 hover:text-white" /> Editar cliente
                                            </button>
                                        )}
                                        {confirmacaoExclusao[index] ? (
                                            <div className='flex flex-row justify-center items-center'>
                                                <p className='text-xl mr-3'>Você tem certeza?</p>
                                                <div className='flex flex-row justify-center space-x-2'>
                                                    <button
                                                        onClick={() => {
                                                            onDelete(index);
                                                            setConfirmacaoExclusao((prev) => ({
                                                                ...prev,
                                                                [index]: false
                                                            }));
                                                        }}
                                                        className='bg-[#e7e7e7] border-red-600 border-2 text-xl w-24 p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-red-600 hover:text-white flex justify-center items-center'
                                                    >
                                                        Sim
                                                    </button>
                                                    <button
                                                        onClick={cancelarExclusao}
                                                        className='bg-[#e7e7e7] border-[#3b82f6] border-2 text-xl w-24 p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex justify-center items-center'
                                                    >
                                                        Não
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => toggleConfirmacaoExclusao(index)}
                                                className='bg-[#e7e7e7] border-red-600 border-2 text-xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-red-600 hover:text-white flex items-center'
                                            >
                                                <MdDelete className="mr-2 hover:text-white" /> Excluir
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editIndex === index && (
                                    <div className='flex flex-col bg-slate-300 p-5 rounded-3xl mt-3'>
                                        <form className='flex flex-col'>
                                            <p>Nome do cliente</p>
                                            <input
                                                type="text"
                                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                                value={editNome}
                                                placeholder='Digite o nome'
                                                onChange={(e) => setEditNome(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <p className='mt-1'>Telefone</p>
                                            <input
                                                type="text"
                                                maxLength={15}
                                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                                value={editTelefone && formatToPhone(editTelefone)}
                                                placeholder='Digite o telefone'
                                                onChange={handleEditTelefoneChange}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </form>
                                        <button
                                            className='bg-[#e7e7e7] border-green-500 border-2 text-lg p-2 mt-3 w-56 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-green-500 hover:text-white flex items-center justify-center'
                                            onClick={handleSaveEdit}
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <div className='flex justify-center items-center text-2xl mt-9'>Nenhum resultado encontrado.</div>
                )}
            </ul>
        </div>
    );
};

export default ListaClientes;
