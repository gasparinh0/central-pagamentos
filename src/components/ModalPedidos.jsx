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
import { BiSave } from "react-icons/bi";
import { FaPrint } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';
import { motion } from "framer-motion"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 850,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    maxHeight: '90vh',
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
    const [produtoQuantidade, setProdutoQuantidade] = useState('');
    const [produtoPreco, setProdutoPreco] = useState('');
    const [total, setTotal] = useState(pedido?.total || 0);
    const [produtos, setProdutos] = useState(pedido?.produtos || []);
    const [historicoAbatimentos, setHistoricoAbatimentos] = useState(pedido?.historicoAbatimentos || []);
    const [valorAbater, setValorAbater] = useState('');
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const [mostrarImprimir, setMostrarImprimir] = useState(true);

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
        const quantidadeNumerica = parseInt(produtoQuantidade, 10); // Converte para número inteiro

        if (!produtoNome || isNaN(precoNumerico) || isNaN(quantidadeNumerica)) {
            alert('Por favor, coloque as informações necessárias para adicionar o produto.');
            return;
        }

        const novoProduto = {
            nome: produtoNome,
            quantidade: quantidadeNumerica,
            preco: precoNumerico
        };

        const produtosAtualizados = [...produtos, novoProduto];
        const totalAtualizado = total + (precoNumerico * quantidadeNumerica);
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
        setProdutoQuantidade('');
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
        setMostrarImprimir(false);
    };

    const cancelarExclusao = () => {
        setConfirmacaoExclusao(false);
        setMostrarImprimir(true);
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
                    <div className='flex flex-row justify-between'>
                        <h1 className='text-3xl'>{pedido.nomeCliente}</h1>
                        <div className='flex flex-row space-x-5 items-center mb-3'>
                            {confirmacaoExclusao ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className='flex flex-row justify-center items-center'>
                                        <p className='text-lg mr-2'>Você tem certeza?</p>
                                        <div className='flex flex-row justify-center space-x-2'>
                                            <button
                                                onClick={handleDeleteCliente}
                                                className='text-lg bg-red-600 w-20 h-10 text-white rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-red-400'
                                            >
                                                Sim
                                            </button>
                                            <button
                                                onClick={cancelarExclusao}
                                                className='text-lg bg-slate-200 w-20 h-10 text-neutral-700 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-slate-100'
                                            >
                                                Não
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <Tooltip title="Arquivar pedido">
                                    <button
                                        onClick={toggleConfirmacaoExclusao}
                                        className='text-xl text-neutral-700 flex justify-center items-center transition-all duration-300'
                                    >
                                        {/* Excluir */}
                                        <BiSave size='30' className='transition-all duration-300 hover:text-neutral-500' />
                                    </button>
                                </Tooltip>
                            )}
                            {mostrarImprimir && (
                                <Tooltip title="Imprimir pedido">
                                    <div>
                                        <ReactToPrint
                                            trigger={() => <button className='text-xl text-neutral-700 flex justify-center items-center transition-all duration-300'><FaPrint size='26' className='transition-all duration-300 hover:text-neutral-500' /></button>}
                                            content={() => printRef.current}
                                        />
                                    </div>
                                </Tooltip>
                            )}
                            <div>
                                <Tooltip title="Fechar">
                                    <div>
                                        <IoIosCloseCircle size="30" onClick={handleClose} style={{ cursor: 'pointer' }} color='#dc2626' />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='flex flex-row justify-between'>
                        <div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Total: <span className='font-semibold'>R$ {(total * 1).toFixed(2)}</span></p>
                            </div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Último pedido feito:</p>
                                <p className='font-semibold'>{pedido.dataPedido}</p>
                            </div>
                            <div className='flex flex-col items-start mt-3'>
                                <div className='flex flex-row space-x-1'>
                                    <p className='w-40'>Produto</p>
                                    <p className='w-20'>Qtd</p>
                                    <p className='w-20'>R$</p>
                                </div>
                                <div className='mt-2'>
                                    {produtos.map((produto, index) => (
                                        <div key={index} className='flex flex-row space-x-1'>
                                            <div className='flex flex-col'>
                                                <div className='flex flex-row space-x-1'>
                                                    <p className='w-40'>{produto.nome}</p>
                                                    <p className='w-20'>{produto.quantidade}</p>
                                                    <p className='w-20'>{produto.preco}</p>
                                                </div>
                                                <div className=' w-72 border-2 border-gray-200'></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                            <Accordion className='mb-4 w-64'>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>Acrescentar produto</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div className='flex flex-col justify-start space-y-2'>
                                            <p>Nome do produto</p>
                                            <input
                                                type="text"
                                                value={produtoNome}
                                                onChange={(e) => setProdutoNome(e.target.value)}
                                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                                onKeyDown={(e) => handleKeyDown(e, handleAddProduto)}
                                                placeholder='Digite o produto'
                                                maxLength='75'
                                            />
                                            <p>Quantidade</p>
                                            <input
                                                type="number"
                                                value={produtoQuantidade}
                                                onChange={(e) => setProdutoQuantidade(e.target.value)}
                                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                                onKeyDown={(e) => handleKeyDown(e, handleAddProduto)}
                                                placeholder='Digite a quantidade'
                                            />
                                            <p>Preço</p>
                                            <input
                                                type="text"
                                                value={produtoPreco}
                                                onChange={(e) => setProdutoPreco(e.target.value.replace(',', '.'))} // Substitui vírgula por ponto
                                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                                onKeyDown={(e) => handleKeyDown(e, handleAddProduto)}
                                                placeholder='Digite o preço'
                                                maxLength='20'
                                            />
                                            <button
                                                onClick={handleAddProduto}
                                                className='text-lg bg-slate-200 mt-3 w-56 h-9 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'
                                            >
                                                Acrescentar
                                            </button>
                                        </div>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className='mb-4  w-64'>
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
                                            className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                            onKeyDown={(e) => handleKeyDown(e, handleAbaterValor)}
                                            placeholder='Digite o valor'
                                        />
                                        <button
                                            onClick={handleAbaterValor}
                                            className='text-lg bg-slate-200 mt-3 w-56 h-9 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'
                                        >
                                            Abater
                                        </button>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
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
