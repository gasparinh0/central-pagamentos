import * as React from 'react';
import { useState } from "react";
import { GoPersonFill } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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

    return (
        <div>
            <ul>
                {clientes.map((cliente, index) => (
                    <li key={index}>
                        <div>
                            <div className='flex bg-[#e5e7eb] p-7 rounded-3xl gap-y-4 mt-5'>
                                <div className='mr-3'>
                                    <GoPersonFill size={72} />
                                </div>
                                <div>
                                    <h1 className='text-3xl'>{cliente.nome}</h1>
                                    <div className='flex space-x-2'>
                                        <p className='text-2xl'>Telefone:</p>
                                        <p className='text-2xl font-light'>{cliente.telefone}</p>
                                    </div>
                                </div>
                                <div className='flex ml-auto space-x-6'>
                                    <button
                                        className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center"
                                        onClick={() => handleEdit(index)}
                                    >
                                        <MdModeEdit className="mr-2 hover:text-white"/> Editar cliente
                                    </button>
                                    <button
                                        className="bg-[#e7e7e7] border-red-600 border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-red-600 hover:text-white flex items-center"
                                        onClick={() => onDelete(index)}
                                    >
                                        <MdDelete className="mr-2 hover:text-white"/> Excluir cliente
                                    </button>
                                </div>
                            </div>
                            {editIndex === index && (
                                <div className='flex flex-col bg-slate-300 p-5 rounded-3xl mt-3'>
                                    <form className='flex flex-col'>
                                        <p>Nome do cliente</p>
                                        <input
                                            type="text"
                                            className='border-gray-950 bg-slate-200 w-48'
                                            value={editNome}
                                            onChange={(e) => setEditNome(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <p>Telefone</p>
                                        <input
                                            type="text"
                                            className='border-gray-950 bg-slate-200 w-48'
                                            value={editTelefone}
                                            onChange={handleEditTelefoneChange}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </form>
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
