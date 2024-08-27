import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

// Imports do Material-UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Imports do React-to-print (função imprimir)
import ReactToPrint from 'react-to-print';

// Imports do react-icons
import { FaFolder } from "react-icons/fa";
import { FaPrint } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdMoneyOff } from "react-icons/md";
import { IoIosReturnLeft } from "react-icons/io";

// Imports do framer-motion (animações)
import { motion } from "framer-motion"

// Imports do brazilian-values (formatação)
import { formatToBRL } from "brazilian-values"

// Estilo do modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    maxHeight: '90vh',
    boxShadow: 24,
    p: 4,
};

//Função para imprimir só uma parte do conteúdo do modal
const PrintComponent = React.forwardRef(({ pedido, total }, ref) => (
    <div ref={ref} className='flex flex-col m-7 printableContent'>
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
    const [dataInicialPedido, setDataInicialPedido] = useState(pedido?.dataPedido || '');
    const [showForm, setShowForm] = useState(false);
    const [showAbater, setShowAbater] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    // Variável para o funcionamento da impressão
    const printRef = useRef();

    useEffect(() => {
        setTotal(pedido?.total || 0);
        setProdutos(pedido?.produtos || []);
        setHistoricoAbatimentos(pedido?.historicoAbatimentos || []);
        setDataInicialPedido(pedido?.dataPedido || '');
    }, [pedido]);

    useEffect(() => {
        if (produtoSelecionado === null) {
            setShowForm(false);
        }
    }, [produtos]);

    useEffect(() => {
        if (pedido) {
            // Verifica se o pedido realmente mudou para evitar resets desnecessários
            setTotal(pedido?.total || 0);
            setProdutos(pedido?.produtos || []);
            setHistoricoAbatimentos(pedido?.historicoAbatimentos || []);
            setDataInicialPedido(pedido?.dataPedido || '');
        }
    }, [pedido]);

    if (!pedido) {
        return null;
    }

    //Função para o menu
    const openMenu = Boolean(anchorEl);
    const handleClick = (event, produto) => {
        setAnchorEl(event.currentTarget);
        setProdutoSelecionado(produto);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    //Função para adicionar produto
    const handleAddProduto = () => {
        const precoNumerico = parseFloat(produtoPreco.replace(',', '.')); // Substitui vírgula por ponto
        const quantidadeNumerica = parseFloat(produtoQuantidade, 10); // Converte para número inteiro
    
        if (!produtoNome || isNaN(precoNumerico) || isNaN(quantidadeNumerica)) {
            alert('Por favor, coloque as informações necessárias para adicionar o produto.');
            return;
        }
    
        let produtosAtualizados;
    
        if (produtoSelecionado) {
            // Edição de produto
            produtosAtualizados = produtos.map((produto) =>
                produto === produtoSelecionado
                    ? { ...produtoSelecionado, nome: produtoNome, quantidade: quantidadeNumerica, preco: precoNumerico }
                    : produto
            );
        } else {
            // Adição de novo produto
            const dataAtual = new Date().toLocaleDateString();
            const novoProduto = {
                nome: produtoNome,
                quantidade: quantidadeNumerica,
                preco: precoNumerico,
                data: produtos.length === 0 ? dataInicialPedido : dataAtual, // Data inicial para o primeiro produto, data atual para os outros
            };
            produtosAtualizados = [...produtos, novoProduto];
        }
    
        const totalAtualizado = produtosAtualizados.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0);
    
        const pedidoAtualizado = {
            ...pedido,
            produtos: produtosAtualizados,
            total: totalAtualizado,
            dataPedido: dataInicialPedido || new Date().toLocaleDateString(),
        };
    
        // Sincronize manualmente o localStorage após a atualização
        atualizarPedido(pedidoAtualizado);
        setProdutos(produtosAtualizados);
        setTotal(totalAtualizado);
    
        // Resete o formulário e a seleção
        setProdutoNome('');
        setProdutoQuantidade('');
        setProdutoPreco('');
        setShowForm(false);
        setProdutoSelecionado(null);
    };

     // Handle para abrir o formulário de edição
     const handleEditProduto = () => {
        if (produtoSelecionado) {
            setProdutoNome(produtoSelecionado.nome);
            setProdutoQuantidade(produtoSelecionado.quantidade);
            setProdutoPreco(produtoSelecionado.preco.toString().replace('.', ',')); // Converte ponto para vírgula
            setShowForm(true);
        }
        handleCloseMenu();
    };

    const handleDeleteProduto = () => {
        const produtosAtualizados = produtos.filter((produto) => produto !== produtoSelecionado);
        const totalAtualizado = produtosAtualizados.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0);
    
        const pedidoAtualizado = {
            ...pedido,
            produtos: produtosAtualizados,
            total: totalAtualizado,
        };
    
        atualizarPedido(pedidoAtualizado);
        setProdutos(produtosAtualizados);
        setTotal(totalAtualizado);
        setProdutoSelecionado(null);  // Limpa a seleção do produto
        handleCloseMenu();
    
        // Força a atualização completa antes de adicionar um novo produto
        setTimeout(() => {
            setProdutoNome('');
            setProdutoQuantidade('');
            setProdutoPreco('');
        }, 0); // Isso garante que o estado seja atualizado antes de permitir novas ações
    };

        const handleClickAdd = () => {
        handleAddProduto();
        setShowForm(false);
    };


    // Handle para abater valor
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

    const handleAbaterClick = () => {
        handleAbaterValor()
        setShowAbater(false);
    }

    // Handle para deletar o cliente
    const handleDeleteCliente = () => {
        deletarPedido(pedido.nomeCliente);
        handleClose();
    };

    // Toggle para confirmar a exclusão
    const toggleConfirmacaoExclusao = () => {
        setConfirmacaoExclusao(!confirmacaoExclusao);
        setMostrarImprimir(false);
    };

    // Toggle para cancelar a exclusão
    const cancelarExclusao = () => {
        setConfirmacaoExclusao(false);
        setMostrarImprimir(true);
    };

    // Handle para prosseguir com o enter
    const handleKeyDown = (e, actionFunction) => {
        if (e.key === 'Enter') {
            actionFunction();
        }
    };

    // Função para tirar o R$ da formatação
    function formatPriceWithoutCurrency(value) {
        // Remove "R$" da string formatada
        const formattedValue = formatToBRL(value);
        const valueWithoutCurrency = formattedValue.replace('R$', '').trim();

        return valueWithoutCurrency;
    }

    const checkEdit = () => {
        // Verifique o estado `showForm` em vez de `setShowForm`
        if (showForm === false) {
            return (
                <div className='flex flex-col'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        key={showForm ? "form" : "list"}
                    >
                        <p className='mt-3'>Histórico de Abatimentos:</p>
                        <ul className='list-disc list-inside ml-5'>
                            {historicoAbatimentos.length === 0 ? (
                                <p className='text-gray-500'>Nenhum abatimento registrado.</p>
                            ) : (
                                historicoAbatimentos.map((abatimento, index) => (
                                    <li key={index}>
                                        R$ {(abatimento.valor * 1).toFixed(2)} - {abatimento.data}
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className='mt-5'>
                            <div className='flex flex-row space-x-2 items-center'>
                                <h1 className='text-lg font-semibold mb-2'>Produtos</h1>
                                <Tooltip title="Adicionar produto">
                                    <div>
                                        <IoMdAddCircleOutline size='27' onClick={() => setShowForm(true)} className='mb-2.5 text-green-500 transition-all duration-300 hover:text-green-300' />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className='max-h-40 overflow-y-auto'>
                                {produtos.length === 0 ? (
                                    <p className='text-gray-500'>Nenhum produto adicionado até agora.</p>
                                ) : (
                                    produtos.map((produto, index) => (
                                        <div key={index} onClick={(event) => handleClick(event, produto)} className='flex justify-between w-[600px] transition-all duration-200 p-1 hover:bg-gray-100 hover:rounded-xl hover:scale-[98%] cursor-pointer'>
                                            <div className='flex flex-row items-center mb-2'>
                                                <div>
                                                    <p>{produto.nome}</p>
                                                    <p className='text-gray-500'>Adicionado em: {produto.data}</p>
                                                </div>
                                            </div>

                                            <div className='flex flex-row items-start space-x-9 justify-start'>
                                                <div>
                                                    <p className='w-20'>Quantidade</p>
                                                    <p>{produto.quantidade}</p>
                                                </div>
                                                <div>
                                                    <p className='w-20'>Valor</p>
                                                    <p>R$ {formatPriceWithoutCurrency(produto.preco)}</p>
                                                </div>
                                                <div>
                                                    <p className='w-20'>Subtotal</p>
                                                    <p>R$ {formatPriceWithoutCurrency(produto.preco * produto.quantidade)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleCloseMenu}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleEditProduto}>Editar</MenuItem>
                                    <MenuItem onClick={handleDeleteProduto}>Excluir</MenuItem>
                                </Menu>
                            </div>
                        </div>

                        <div className='mt-5 flex flex-row space-x-3'>
                            <h1 className='text-xl font-semibold mb-2'>Total: R$ {total.toFixed(2)}</h1>
                            <Tooltip title="Abater valor" className='mb-6'>
                                <div>
                                    <MdMoneyOff size='27' onClick={() => setShowAbater(true)} className='text-neutral-700 transition-all duration-300 hover:text-neutral-500' />
                                </div>
                            </Tooltip>
                        </div>
                    </motion.div>
                    {abaterCheck()}
                </div>
            );
        } else {
            return (
                <div className='flex flex-col justify-start space-y-2'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        key={showForm ? "form" : "list"}
                    >
                        <button
                            onClick={() => setShowForm(false)}
                            className='text-lg w-56 h-9 flex items-center transition-all duration-300 text-neutral-700 hover:text-neutral-400'
                        >
                            <IoIosReturnLeft />
                            Voltar
                        </button>
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
                            onClick={handleClickAdd}
                            className='text-lg bg-slate-200 mt-3 w-56 h-9 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'
                        >
                            Acrescentar
                        </button>
                    </motion.div>
                </div>
            );
        }
    };

    const abaterCheck = () => {
        if (showAbater === true) {
            return (
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p>Valor para abater</p>
                        <div className='flex flex-row items-center space-x-2'>
                            <input
                                type="text"
                                value={valorAbater}
                                onChange={(e) => setValorAbater(e.target.value.replace(',', '.'))} // Substitui vírgula por ponto
                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                onKeyDown={(e) => handleKeyDown(e, handleAbaterValor)}
                                placeholder='Digite o valor'
                            />
                            <button
                                onClick={handleAbaterClick}
                                className='text-lg bg-slate-200 w-28 h-9 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'
                            >
                                Abater
                            </button>
                        </div>
                    </motion.div>
                </div>
            )
        }
    }


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
                        <div>
                            <h1 className='text-3xl'>{pedido.nomeCliente}</h1>
                            <div className='flex flex-row space-x-2'>
                                <p>Último pedido feito:</p>
                                <p className='font-semibold'>{pedido.dataPedido}</p>
                            </div>
                        </div>
                        <div className='flex flex-row space-x-5 items-center mb-3'>
                            {confirmacaoExclusao ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className='flex flex-row justify-end items-center'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <p className='text-lg'>Você tem certeza?</p>
                                            <div className='flex flex-row space-x-2'>
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
                                    </div>
                                </motion.div>
                            ) : (
                                <Tooltip title="Arquivar pedido">
                                    <button
                                        onClick={toggleConfirmacaoExclusao}
                                        className='text-xl text-neutral-700 flex justify-center items-center transition-all duration-300'
                                    >
                                        {/* Excluir */}
                                        <FaFolder size='30' className='transition-all duration-300 hover:text-neutral-500' />
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
                            <Tooltip title="Fechar modal">
                                <button
                                    onClick={handleClose}
                                    className='text-xl text-neutral-700 flex justify-center items-center transition-all duration-300'
                                >
                                    {/* Fechar */}
                                    <IoIosCloseCircle size='34' className='transition-all duration-300 hover:text-neutral-500' />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {checkEdit()}
                </Typography>
                <div style={{ display: 'none' }}>
                    <PrintComponent ref={printRef} pedido={pedido} total={total} />
                </div>
            </Box>
        </Modal>
    );
};

export default BasicModal;
