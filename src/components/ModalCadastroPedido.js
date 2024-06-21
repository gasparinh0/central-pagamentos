import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalCadastroPedido = ({ open, handleClose }) => {
    const [nomeCliente, setNomeCliente] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [produtos, setProdutos] = useState([{ nome: '', preco: 0 }]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const novoTotal = produtos.reduce((acc, produto) => acc + parseFloat(produto.preco || 0), 0);
        setTotal(novoTotal);
    }, [produtos]);

    const handleAddProduto = () => {
        setProdutos([...produtos, { nome: '', preco: 0 }]);
    };

    const handleChangeProduto = (index, key, value) => {
        const newProdutos = [...produtos];
        newProdutos[index][key] = value;
        setProdutos(newProdutos);
    };

    const handleSave = () => {
        const pedido = {
            nomeCliente,
            dataPedido,
            produtos,
            total,
        };
        const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
        pedidosSalvos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidosSalvos));
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <h1 className='text-3xl'>Cadastrar pedido</h1>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='flex flex-col'>
                        <p>Nome do cliente:</p>
                        <input 
                            type="text" 
                            value={nomeCliente} 
                            onChange={(e) => setNomeCliente(e.target.value)} 
                            className='border-gray-950 bg-slate-200 w-48' 
                        />
                        <p>Data do pedido:</p>
                        <input 
                            type="text" 
                            value={dataPedido} 
                            onChange={(e) => setDataPedido(e.target.value)} 
                            className='border-gray-950 bg-slate-200 w-48' 
                        />
                        <div className='flex flex-col space-y-3 mt-3'>
                            <p>Produtos e Preços:</p>
                            {produtos.map((produto, index) => (
                                <div key={index} className='flex flex-row space-x-3'>
                                    <input
                                        type="text"
                                        placeholder="Produto"
                                        value={produto.nome}
                                        onChange={(e) => handleChangeProduto(index, 'nome', e.target.value)}
                                        className='border-gray-950 bg-slate-200 w-48'
                                    />
                                    <input
                                        type="number"
                                        placeholder="Preço"
                                        value={produto.preco}
                                        onChange={(e) => handleChangeProduto(index, 'preco', e.target.value)}
                                        className='border-gray-950 bg-slate-200 w-24'
                                    />
                                    {index === 0 && (
                                        <button onClick={handleAddProduto} className='bg-slate-400 text-xs'>
                                            Adicionar produto
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='mt-3'>
                            <p>Total: R$ {total.toFixed(2)}</p>
                        </div>
                        <button onClick={handleSave} className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'>Cadastrar</button>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
};

export default ModalCadastroPedido;
