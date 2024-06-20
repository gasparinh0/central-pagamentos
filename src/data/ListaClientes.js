import * as React from 'react';
import { BsPersonCircle } from "react-icons/bs";

const ListaClientes = ({ clientes }) => {
    return (
        <div>
            <h2>Lista de Clientes</h2>
            <ul>
                {clientes.map((cliente, index) => (
                    <li key={index}>
                        <div>
                            {/* Conteúdo da aba Clientes */}
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
                                    <button className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'>Editar cliente</button>
                                    <button className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'>Excluir cliente</button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaClientes;

