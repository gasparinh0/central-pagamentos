import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReactToPrint from 'react-to-print';

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

const PrintComponent = React.forwardRef(({ pedido, total }, ref) => (
    <div ref={ref} className='flex flex-col m-7'>
        <h1 className='mb-3 font-bold'>Atualização de faturamento</h1>
        <p>Nome do cliente: {pedido.nomeCliente}</p>
        <p>Valor total: R$ {(total * 1).toFixed(2)}</p>
        <p>Data do pedido: {pedido.dataPedido}</p>
    </div>
));

const BasicModal = ({ open, handleClose, pedido, atualizarPedido, deletarPedido }) => {
    const [produtoNome, setProdutoNome] = useState('');
    const [produtoPreco, setProdutoPreco] = useState('');
    const [total, setTotal] = useState(pedido?.total || 0);
    const [produtos, setProdutos] = useState(pedido?.produtos || []);
    const [historicoAbatimentos, setHistoricoAbatimentos] = useState(pedido?.historicoAbatimentos || []);
    const [valorAbater, setValorAbater] = useState('');
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);

    const printRef = useRef();

    useEffect(() => {
        setTotal(pedido?.total || 0);
        setProdutos(pedido?.produtos || []);
        setHistoricoAbatimentos(pedido?.historicoAbatimentos || []);
    }, [pedido]);

    if (!pedido) {
        return null;
    }

    const handleAddProduto = () => {
        const precoNumerico = parseFloat(produtoPreco.replace(',', '.')); // Substitui vírgula por ponto
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

        atualizarPedido(pedidoAtualizado);
        setProdutos(produtosAtualizados);
        setTotal(totalAtualizado);
        setProdutoNome('');
        setProdutoPreco('');
    };

    const handleAbaterValor = () => {
        const valorNumerico = parseFloat(valorAbater.replace(',', '.')); // Substitui vírgula por ponto
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

        atualizarPedido(pedidoAtualizado);
        setHistoricoAbatimentos(historicoAtualizado);
        setTotal(totalAtualizado);
        setValorAbater('');
    };

    const handleDeleteCliente = () => {
        deletarPedido(pedido.nomeCliente);
        handleClose();
    };

    const toggleConfirmacaoExclusao = () => {
        setConfirmacaoExclusao(!confirmacaoExclusao);
    };

    const cancelarExclusao = () => {
        setConfirmacaoExclusao(false);
    };

    const handleKeyDown = (e, actionFunction) => {
        if (e.key === 'Enter') {
            actionFunction();
        }
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
                                                onKeyDown={(e) => handleKeyDown(e, handleAddProduto)}
                                            />
                                            <p>Preço</p>
                                            <input
                                                type="text"
                                                value={produtoPreco}
                                                onChange={(e) => setProdutoPreco(e.target.value.replace(',', '.'))} // Substitui vírgula por ponto
                                                className='border-gray-950 bg-slate-200'
                                                onKeyDown={(e) => handleKeyDown(e, handleAddProduto)}
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
                                            onChange={(e) => setValorAbater(e.target.value.replace(',', '.'))} // Substitui vírgula por ponto
                                            className='border-gray-950 bg-slate-200'
                                            onKeyDown={(e) => handleKeyDown(e, handleAbaterValor)}
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
                            {confirmacaoExclusao ? (
                                <div>
                                    <hr className='mt-4 mb-2' />
                                    <p className='text-xl'>Você tem certeza?</p>
                                    <button
                                        onClick={handleDeleteCliente}
                                        className='bg-red-500 mt-2 p-4 rounded-full text-2xl'
                                    >
                                        Sim
                                    </button>
                                    <button
                                        onClick={cancelarExclusao}
                                        className='bg-gray-400 mt-2 p-4 rounded-full text-2xl'
                                    >
                                        Não
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={toggleConfirmacaoExclusao}
                                    className='bg-slate-400 mt-2 p-4 rounded-full text-2xl'
                                >
                                    Excluir
                                </button>
                            )}
                            <ReactToPrint
                                trigger={() => <button className='bg-slate-400 mt-2 p-4 rounded-full text-2xl'>Imprimir</button>}
                                content={() => printRef.current}
                            />
                        </div>
                    </div>
                </Typography>
                <div style={{ display: 'none' }}>
                    <PrintComponent ref={printRef} pedido={pedido} total={total} />
                </div>
            </Box>
        </Modal>
    );
};

export default BasicModal;
