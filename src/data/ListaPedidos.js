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
        return <div className='flex justify-center items-center text-2xl mt-9'>Nenhum pedido encontrado.</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-4 gap-x-4 gap-y-4 p-4'>
                {pedidos.map((pedido, index) => (
                    <div key={index} className='bg-[#e5e7eb] p-6 rounded-xl shadow-lg'>
                        <p className='text-xl font-light'>Cliente:</p>
                        <h1 className='text-3xl mb-5'>{pedido.nomeCliente}</h1>
                        <div className='flex space-x-2'>
                            <p>Total do pedido:</p>
                            <p className='font-semibold'>R$ {(pedido.total * 1).toFixed(2)}</p>
                        </div>
                        <div className='flex space-x-2'>
                            <p>Último pedido feito:</p>
                            <p className='font-semibold'>{pedido.dataPedido}</p>
                        </div>
                        <button
                            onClick={() => handleOpenModalPedidos(pedido)}
                            className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-lg p-3 mt-3 h-12 w-40 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center justify-center"
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
