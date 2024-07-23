import React, { useState, useEffect } from 'react';
import BasicModal from "./ModalPedidos";
import ListaClientes from '../data/ListaClientes';
import ResumoPedido from '../data/ListaPedidos';  // Importa o ResumoPedido
import Navbar from './Navbar';  // Importa a Navbar

import { ToastContainer } from 'react-toastify';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const clientesArmazenados = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(clientesArmazenados);

        const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];
        setPedidos(pedidosArmazenados);
    }, []);

    useEffect(() => {
        if (activeTab === 'marcacoes') {
            const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];
            setPedidos(pedidosArmazenados);
        }
    }, [activeTab]);

    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
    };

    const handleClienteCadastrado = (novoCliente) => {
        const clientesAtualizados = [...clientes, novoCliente];
        setClientes(clientesAtualizados);
        localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
    };

    const handlePedidoCadastrado = (novoPedido) => {
        const pedidosAtualizados = [...pedidos, novoPedido];
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
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

    const handleDeletePedido = (index) => {
        const novosPedidos = pedidos.filter((_, i) => i !== index);
        setPedidos(novosPedidos);
        localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
    };

    return (
        <>
        <div>
            <Navbar onClienteCadastrado={handleClienteCadastrado} onPedidoCadastrado={handlePedidoCadastrado} />
            <div className="container mx-auto p-8 bg-white mt-6 rounded-xl shadow-xl">
                <div className="relative flex justify-around text-3xl space-x-4 border-b">
                    <button
                        className={`py-2 px-4 transition-colors duration-300 ${activeTab === 'clientes' ? 'text-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('clientes')}
                    >
                        Clientes
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
                        <ResumoPedido pedidosProp={pedidos} onDelete={handleDeletePedido} />
                    )}
                </div>
                <BasicModal open={modalPedidosOpen} handleClose={handleCloseModalPedidos} />
            </div>
        </div>
        <ToastContainer/>
        </>

    );
};

export default Tabs;

