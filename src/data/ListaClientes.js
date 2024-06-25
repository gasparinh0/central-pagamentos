import * as React from 'react';
import { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";

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

const ListaClientes = ({ clientes, onDelete, onEdit }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editTelefone, setEditTelefone] = useState('');

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
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setEditTelefone(formattedPhoneNumber);
    };

    return (
        <div>
            <ul>
                {clientes.map((cliente, index) => (
                    <li key={index}>
                        <div>
                            <div className='flex bg-slate-200 p-7 rounded-3xl gap-y-4 mt-5'>
                                <div className='bg-slate-400 p-2 mr-3 content-none rounded-full'>
                                    <BsPersonCircle size={60} />
                                </div>
                                <div>
                                    <h1 className='text-3xl'>{cliente.nome}</h1>
                                    <div className='flex space-x-2'>
                                        <p className='text-2xl'>Telefone:</p>
                                        <p className='text-2xl font-light'>{cliente.telefone}</p>
                                    </div>
                                </div>
                                <div className='flex ml-auto'>
                                    <button
                                        className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'
                                        onClick={() => handleEdit(index)}
                                    >
                                        Editar cliente
                                    </button>
                                    <button
                                        className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'
                                        onClick={() => onDelete(index)}
                                    >
                                        Excluir cliente
                                    </button>
                                </div>
                            </div>
                            {editIndex === index && (
                                <div className='flex flex-col bg-slate-300 p-5 rounded-3xl mt-3'>
                                    <div className='flex flex-col'>
                                        <p>Nome do cliente</p>
                                        <input
                                            type="text"
                                            className='border-gray-950 bg-slate-200 w-48'
                                            value={editNome}
                                            onChange={(e) => setEditNome(e.target.value)}
                                        />
                                        <p>Telefone</p>
                                        <input
                                            type="text"
                                            className='border-gray-950 bg-slate-200 w-48'
                                            value={editTelefone}
                                            onChange={handleEditTelefoneChange}
                                        />
                                    </div>
                                    <button
                                        className='mt-3 bg-slate-400 p-2 w-56 rounded-xl'
                                        onClick={handleSaveEdit}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaClientes;
