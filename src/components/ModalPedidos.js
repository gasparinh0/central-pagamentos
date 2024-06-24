import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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

const BasicModal = ({ open, handleClose, pedido, atualizarPedido, deletarPedido }) => {
    const [produtoNome, setProdutoNome] = useState('');
    const [produtoPreco, setProdutoPreco] = useState('');
    const [total, setTotal] = useState(pedido?.total || 0);
    const [produtos, setProdutos] = useState(pedido?.produtos || []);
    const [historicoAbatimentos, setHistoricoAbatimentos] = useState(pedido?.historicoAbatimentos || []);
    const [valorAbater, setValorAbater] = useState('');

    useEffect(() => {
        setTotal(pedido?.total || 0);
        setProdutos(pedido?.produtos || []);
        setHistoricoAbatimentos(pedido?.historicoAbatimentos || []);
    }, [pedido]);

    if (!pedido) {
        return null;
    }

    const handleAddProduto = () => {
        const precoNumerico = parseFloat(produtoPreco);
        if (isNaN(precoNumerico)) {
            alert('Por favor, insira um valor numérico válido para o preço.');
            return;
        }

        const novoProduto = {
            nome: produtoNome,
            preco: precoNumerico
        };

        const produtosAtualizados = [...produtos, novoProduto];
        const totalAtualizado = total + precoNumerico;
        const dataAtualizada = new Date().toLocaleDateString();

        const pedidoAtualizado = {
            ...pedido,
            produtos: produtosAtualizados,
            total: totalAtualizado,
            dataPedido: dataAtualizada
        };

        atualizarPedido(pedidoAtualizado); // Atualiza o pedido no componente pai
        setProdutos(produtosAtualizados); // Atualiza o estado local de produtos
        setTotal(totalAtualizado); // Atualiza o estado local do total
        setProdutoNome(''); // Limpa o campo de nome do produto
        setProdutoPreco(''); // Limpa o campo de preço do produto
    };

    const handleAbaterValor = () => {
        const valorNumerico = parseFloat(valorAbater);
        if (isNaN(valorNumerico)) {
            alert('Por favor, insira um valor numérico válido para o valor a abater.');
            return;
        }

        const totalAtualizado = total - valorNumerico;
        const dataAtualizada = new Date().toLocaleDateString();

        const historicoAtualizado = [...historicoAbatimentos, { valor: valorNumerico, data: dataAtualizada }];

        const pedidoAtualizado = {
            ...pedido,
            total: totalAtualizado,
            historicoAbatimentos: historicoAtualizado,
        };

        atualizarPedido(pedidoAtualizado); // Atualiza o pedido no componente pai
        setHistoricoAbatimentos(historicoAtualizado); // Atualiza o estado local do histórico de abatimentos
        setTotal(totalAtualizado); // Atualiza o estado local do total
        setValorAbater(''); // Limpa o campo de valor a abater
    };

    const handleDeleteCliente = () => {
        deletarPedido(pedido.nomeCliente);
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
                    <h1 className='text-3xl'>{pedido.nomeCliente}</h1>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='grid grid-cols-2'>
                        <div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Total: R$ {(total * 1).toFixed(2)}</p>
                            </div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Último pedido feito:</p>
                                <p>{pedido.dataPedido}</p>
                            </div>
                            <p className='mt-3'>Produtos obtidos:</p>
                            <ul className='list-disc list-inside ml-5'>
                                {produtos.map((produto, index) => (
                                    <li key={index}>
                                        {produto.nome} - R$ {(produto.preco * 1).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                            <p className='mt-3'>Histórico de Abatimentos:</p>
                            <ul className='list-disc list-inside ml-5'>
                                {historicoAbatimentos.map((abatimento, index) => (
                                    <li key={index}>
                                        R$ {(abatimento.valor * 1).toFixed(2)} - {abatimento.data}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>Acrescentar produto</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div className='flex flex-col justify-start'>
                                            <p>Nome do produto</p>
                                            <input 
                                                type="text" 
                                                value={produtoNome} 
                                                onChange={(e) => setProdutoNome(e.target.value)} 
                                                className='border-gray-950 bg-slate-200' 
                                            />
                                            <p>Preço</p>
                                            <input 
                                                type="text" 
                                                value={produtoPreco} 
                                                onChange={(e) => setProdutoPreco(e.target.value)} 
                                                className='border-gray-950 bg-slate-200' 
                                            />
                                            <button 
                                                onClick={handleAddProduto} 
                                                className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'
                                            >
                                                Acrescentar
                                            </button>
                                        </div>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>Abater valor</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <p>Valor para abater</p>
                                        <input 
                                            type="text" 
                                            value={valorAbater}
                                            onChange={(e) => setValorAbater(e.target.value)} 
                                            className='border-gray-950 bg-slate-200'
                                        />
                                        <button 
                                            onClick={handleAbaterValor} 
                                            className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'
                                        >
                                            Abater
                                        </button>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <button 
                                onClick={handleDeleteCliente} 
                                className='bg-slate-400 mt-2 p-4 rounded-full text-2xl'
                            >
                                Apagar
                            </button>
                        </div>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
};

export default BasicModal;
