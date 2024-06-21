import React, { useState, useEffect } from 'react';
import BasicModal from "./ModalPedidos";
import ListaClientes from '../data/ListaClientes';
import ModalCadastroCliente from './ModalCadastroCliente';
import ListaPedidos from '../data/ListaPedidos';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const clientesArmazenados = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(clientesArmazenados);
    }, []);

    const handleCloseModalCadastro = () => {
        setModalCadastroOpen(false);
    };

    const handleOpenModalPedidos = () => {
        setModalPedidosOpen(true);
    };

    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
    };

    const handleClienteCadastrado = (novoCliente) => {
        setClientes((prevClientes) => [...prevClientes, novoCliente]);
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
                    < ListaPedidos/>
                )}
            </div>
            <BasicModal open={modalPedidosOpen} handleClose={handleCloseModalPedidos} />
            <ModalCadastroCliente open={modalCadastroOpen} handleClose={handleCloseModalCadastro} onClienteCadastrado={handleClienteCadastrado} />
        </div>
    );
};

export default Tabs;
