import React, { useState, useEffect } from 'react';

//Imports de componentes
import BasicModal from "./ModalPedidos";
import ListaClientes from '../data/ListaClientes';
import ResumoPedido from '../data/ListaPedidos';  // Importa o ResumoPedido
import Navbar from './Navbar';  // Importa a Navbar

//Imports do react-toastify
import { ToastContainer } from 'react-toastify';

//Imports do material ui
import Skeleton from '@mui/material/Skeleton';

//Import do framer-motion
import { motion } from "framer-motion"

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('clientes');
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    //UseEffect para atualizar as listas
    useEffect(() => {
        const clientesArmazenados = JSON.parse(localStorage.getItem('clientes')) || [];
        const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];

        setClientes(clientesArmazenados);
        setPedidos(pedidosArmazenados);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (activeTab === 'marcacoes') {
            const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];
            setPedidos(pedidosArmazenados);
        }
    }, [activeTab]);

    //Handle para fechar o modal
    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
    };

    //Handle para cliente
    const handleClienteCadastrado = (novoCliente) => {
        const clientesAtualizados = [...clientes, novoCliente];
        setClientes(clientesAtualizados);
        localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));
    };

    //Handle para pedido
    const handlePedidoCadastrado = (novoPedido) => {
        const pedidosAtualizados = [...pedidos, novoPedido];
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
    };

    // Handle para deletar cliente usando o ID
    const handleDeleteCliente = (idCliente) => {
        const novosClientes = clientes.filter(cliente => cliente.id !== idCliente);
        setClientes(novosClientes);
        localStorage.setItem('clientes', JSON.stringify(novosClientes));
    };


    //Handle para editar cliente
    const handleEditCliente = (idCliente, clienteAtualizado) => {
        const novosClientes = [...clientes];
        const index = novosClientes.findIndex(cliente => cliente.id === idCliente);

        if (index !== -1) {
            // Preserva o ID do cliente existente
            novosClientes[index] = { ...clienteAtualizado, id: novosClientes[index].id };

            localStorage.setItem('clientes', JSON.stringify(novosClientes));
            setClientes(novosClientes);
        } else {
            console.error('Cliente não encontrado para atualização');
        }
    };

    // Handle para deletar pedido usando o ID
    const handleDeletePedido = (pedidoId) => {
        const novosPedidos = pedidos.filter(pedido => pedido.id !== pedidoId);
        setPedidos(novosPedidos);
        localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
    };

    return (
        <>
            <div>
                <Navbar onClienteCadastrado={handleClienteCadastrado} onPedidoCadastrado={handlePedidoCadastrado} />
                <div className="container mx-auto p-8 bg-white mt-6 rounded-xl shadow-xl">
                    <div className="relative flex justify-around text-3xl space-x-4 border-b">
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width={100} height={40} />
                                <Skeleton variant="text" width={100} height={40} />
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                        {!isLoading && (
                            <span
                                className={`absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 transition-transform duration-300 transform ${activeTab === 'clientes' ? 'translate-x-0' : 'translate-x-full'}`}
                            />
                        )}
                    </div>
                    <div className="mt-4">
                        {isLoading ? (
                            <>
                                <Skeleton variant="rectangular" width="100%" height={400} />
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
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
                                    <div>
                                        <ResumoPedido pedidosProp={pedidos} onDelete={handleDeletePedido} />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                    <BasicModal open={modalPedidosOpen} handleClose={handleCloseModalPedidos} />
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Tabs;
