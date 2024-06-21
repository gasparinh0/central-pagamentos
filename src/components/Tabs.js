import React, { useState, useEffect } from 'react';
import BasicModal from "./ModalPedidos";
import ListaClientes from '../data/ListaClientes';
import ListaPedidos from '../data/ListaPedidos';
import Navbar from './Navbar';  // Importa a Navbar

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const clientesArmazenados = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(clientesArmazenados);
    }, []);

    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
    };

    const handleClienteCadastrado = (novoCliente) => {
        const clientesAtualizados = [...clientes, novoCliente];
        setClientes(clientesAtualizados);
        localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
    };

    const handleDeleteCliente = (index) => {
        const novosClientes = clientes.filter((_, i) => i !== index);
        setClientes(novosClientes);
        localStorage.setItem('clientes', JSON.stringify(novosClientes));
    };

    const handleEditCliente = (index, clienteAtualizado) => {
        const novosClientes = [...clientes];
        novosClientes[index] = clienteAtualizado;
        setClientes(novosClientes);
        localStorage.setItem('clientes', JSON.stringify(novosClientes));
    };

    return (
        <div>
            <Navbar onClienteCadastrado={handleClienteCadastrado} />  {/* Passa a função para a Navbar */}
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
                            <ListaClientes
                                clientes={clientes}
                                onDelete={handleDeleteCliente}
                                onEdit={handleEditCliente}
                            />
                        </div>
                    )}
                    {activeTab === 'marcacoes' && (
                        <ListaPedidos />
                    )}
                </div>
                <BasicModal open={modalPedidosOpen} handleClose={handleCloseModalPedidos} />
            </div>

        </div>
    );
};

export default Tabs;
