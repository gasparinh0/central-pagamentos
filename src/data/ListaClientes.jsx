import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import { MdModeEdit, MdDelete, MdFilterAlt } from "react-icons/md";
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { formatToPhone } from 'brazilian-values';

const ITEMS_PER_PAGE = 10;

const ListaClientes = ({ clientes, onDelete, onEdit }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [colors, setColors] = useState({});
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState(clientes);
    const [isAlphabetical, setIsAlphabetical] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [anchorEl, setAnchorEl] = useState(null); // Definido anchorEl
    const open = Boolean(anchorEl); // Definido open

    const listRef = useRef(null);

    useEffect(() => {
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

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        listRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const paginatedClientes = filteredClientes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const pageCount = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);

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
        <div ref={listRef}>
            <div className='flex flex-row justify-between'>
                <input
                    type="text"
                    className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                    placeholder='Pesquisar'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className='flex items-center'
                >
                    <MdFilterAlt size='40' /> Filtros
                </button>
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
                {paginatedClientes.length > 0 ? (
                    paginatedClientes.map((cliente, index) => (
                        <li key={index}>
                            <div>
                                <div className='flex bg-gray-100 p-7 rounded-3xl gap-y-4 mt-5 shadow-md'>
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
                                    <div className='flex ml-auto items-center space-x-6'>
                                        {!confirmacaoExclusao[index] && (
                                            <Tooltip title="Editar">
                                            <button
                                                className="text-xl bg-slate-200 w-14 h-12 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:bg-[#3b82f6] hover:text-white"
                                                onClick={() => handleEdit(index)}
                                            >
                                                {/* Editar */}
                                                <MdModeEdit />
                                            </button>
                                            </Tooltip>
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
                                                        className='text-xl bg-red-600 w-24 h-12 text-white rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-red-400'
                                                    >
                                                        Sim
                                                    </button>
                                                    <button
                                                        onClick={cancelarExclusao}
                                                        className='text-xl bg-[#3b82f6] w-24 h-12 text-white rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-[#769aff]'
                                                    >
                                                        Não
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Tooltip title="Excluir">
                                            <button
                                                onClick={() => toggleConfirmacaoExclusao(index)}
                                                className='text-xl bg-slate-200 w-14 h-12 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:bg-red-600 hover:text-white'
                                            >
                                                {/* Excluir */}
                                                <MdDelete />
                                            </button>
                                            </Tooltip>
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
                                            className='text-lg bg-slate-200 w-44 mt-3 h-10 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:bg-slate-100'
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
            <div className='flex justify-center mt-8'>
                <Stack spacing={2}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Stack>
            </div>
        </div>
    );
};

export default ListaClientes;
