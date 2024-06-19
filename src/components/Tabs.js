import React, { useState } from 'react';

// Imports do react-icons
import { BsPersonCircle } from "react-icons/bs";

// Imports de componentes
import BasicModal from "./Modal";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
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
                        {/* Conteúdo da aba Clientes */}
                        <div className='flex bg-slate-200 p-7 rounded-3xl gap-y-4'>
                            <div className='bg-slate-400 p-2 mr-3 content-none rounded-full'>
                                <BsPersonCircle size={60} />
                            </div>
                            <div>
                                <h1 className='text-3xl'>Nome do cliente</h1>
                                <div className='flex space-x-2'>
                                    <p className='text-2xl'>Telefone:</p>
                                    <p className='text-2xl font-light'>19998324253</p>
                                </div>
                            </div>
                            <div className='flex ml-auto'>
                                <button className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'>Editar cliente</button>
                                <button className='bg-slate-400 mr-8 text-2xl p-3 rounded-full'>Excluir cliente</button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'marcacoes' && (
                    <div>
                        {/* Conteúdo da aba Marcações */}
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
                            {/* fim do grid */}
                        </div>
                    </div>
                )}
            </div>
            <BasicModal open={modalOpen} handleClose={handleCloseModal} />
        </div>
    );
};

export default Tabs;
