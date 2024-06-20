import React, { useState, useEffect } from 'react';
import BasicModal from "./ModalPedidos";
import ListaClientes from '../data/ListaClientes';
import ModalCadastroCliente from './ModalCadastroCliente';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalOpen, setModalOpen] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const clientesArmazenados = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(clientesArmazenados);
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClienteCadastrado = (novoCliente) => {
        setClientes((prevClientes) => [...prevClientes, novoCliente]);
    };

    const handleDeleteCliente = (index) => {
        const novosClientes = clientes.filter((_, i) => i !== index);
        setClientes(novosClientes);
        localStorage.setItem('clientes', JSON.stringify(novosClientes));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="relative flex justify-around text-3xl space-x-4 border-b">
                <button
                    className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'clientes' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('clientes')}
                >
                    Clientes autorizados
                </button>
                <button
                    className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'marcacoes' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('marcacoes')}
                >
                    Pedidos
                </button>
                <span
                    className={`absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 transition-transform duration-300 transform ${activeTab === 'clientes' ? 'translate-x-0' : 'translate-x-full'}`}
                />
            </div>
            <div className="mt-4">
                {activeTab === 'clientes' && (
                    <div>
                        <ListaClientes clientes={clientes} onDelete={handleDeleteCliente} />
                    </div>
                )}
                {activeTab === 'marcacoes' && (
                    <div>
                        <div className='grid grid-cols-4 gap-x-36 gap-y-12'>
                            <div className='flex justify-center items-center flex-col bg-slate-200 w-96 p-10 rounded-xl'>
                                <p className='text-2xl'>Cliente:</p>
                                <h1 className='text-3xl mb-5'>Nome do cliente</h1>
                                <div className='flex space-x-2'>
                                    <p>Total do pedido:</p>
                                    <p>R$100</p>
                                </div>
                                <div className='flex space-x-2'>
                                    <p>Último pedido feito:</p>
                                    <p>23/06/2019</p>
                                </div>
                                <button onClick={handleOpenModal} className='bg-slate-400 mt-6 p-4 rounded-full text-2xl'> Visualizar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <BasicModal open={modalOpen} handleClose={handleCloseModal} />
            <ModalCadastroCliente open={modalOpen} handleClose={handleCloseModal} onClienteCadastrado={handleClienteCadastrado} />
        </div>
    );
};

export default Tabs;
