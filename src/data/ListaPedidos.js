import * as React from 'react';
import { useEffect, useState } from 'react';
import BasicModal from "../components/ModalPedidos";

const ResumoPedido = ({ pedidosProp, onDelete }) => {
    const [pedidos, setPedidos] = useState(pedidosProp || []);
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    useEffect(() => {
        if (pedidosProp) {
            setPedidos(pedidosProp);
        } else {
            const savedPedidos = localStorage.getItem('pedidos');
            if (savedPedidos) {
                setPedidos(JSON.parse(savedPedidos));
            }
        }
    }, [pedidosProp]);

    const handleOpenModalPedidos = (pedido) => {
        setPedidoSelecionado(pedido);
        setModalPedidosOpen(true);
    };

    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
        setPedidoSelecionado(null);
    };

    const atualizarPedido = (pedidoAtualizado) => {
        const pedidosAtualizados = pedidos.map(p => p.nomeCliente === pedidoAtualizado.nomeCliente ? pedidoAtualizado : p);
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
    };

    const deletarPedido = (index) => {
        const pedidosAtualizados = pedidos.filter((_, i) => i !== index);
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
        if (onDelete) {
            onDelete(index);
        }
    };

    if (pedidos.length === 0) {
        return <div>Nenhum pedido encontrado.</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-4 gap-x-4 gap-y-4 p-4'>
                {pedidos.map((pedido, index) => (
                    <div key={index} className='bg-slate-200 p-6 rounded-xl shadow-lg'>
                        <p className='text-2xl'>Cliente:</p>
                        <h1 className='text-3xl mb-5'>{pedido.nomeCliente}</h1>
                        <div className='flex space-x-2'>
                            <p>Total do pedido:</p>
                            <p>R$ {(pedido.total * 1).toFixed(2)}</p>
                        </div>
                        <div className='flex space-x-2'>
                            <p>Último pedido feito:</p>
                            <p>{pedido.dataPedido}</p>
                        </div>
                        <button
                            onClick={() => handleOpenModalPedidos(pedido)}
                            className='bg-slate-400 mt-6 p-4 rounded-full text-2xl'
                        >
                            Visualizar
                        </button>
                    </div>
                ))}
            </div>
            {pedidoSelecionado && (
                <BasicModal
                    open={modalPedidosOpen}
                    handleClose={handleCloseModalPedidos}
                    pedido={pedidoSelecionado}
                    atualizarPedido={atualizarPedido}
                    deletarPedido={() => deletarPedido(pedidos.indexOf(pedidoSelecionado))}
                />
            )}
        </div>
    );
};

export default ResumoPedido;
