import * as React from 'react';

// Imports do React
import { useEffect, useState, useRef } from 'react';

// Imports de componentes
import BasicModal from "../components/ModalPedidos";

//Imports do react-toastify
import { notifySuccess } from '../components/ui/Toast';

// Imports do react-icons
import { MdFilterAlt } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

// Imports do material-ui
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// Variável que determina a quantidade de pedidos por página
const ITEMS_PER_PAGE = 12;

const ResumoPedido = ({ pedidosProp }) => {
    const [pedidos, setPedidos] = useState([]);
    const [paidOrders, setPaidOrders] = useState([]);
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAlphabetical, setIsAlphabetical] = useState(false);
    const [isMostRecent, setIsMostRecent] = useState(false);
    const [isOldest, setIsOldest] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [currentPage, setCurrentPage] = useState(1);
    const listRef = useRef(null);

    useEffect(() => {
        // Carregar pedidos ativos
        const savedPedidos = localStorage.getItem('pedidos');
        if (savedPedidos) {
            const pedidosAtivos = JSON.parse(savedPedidos);
            setPedidos(pedidosAtivos);
        }

        // Carregar pedidos pagos
        const savedPaidOrders = localStorage.getItem('paidOrders');
        if (savedPaidOrders) {
            setPaidOrders(JSON.parse(savedPaidOrders));
        } else {
            localStorage.setItem('paidOrders', JSON.stringify([]));
        }
    }, [pedidosProp]);

    useEffect(() => {
        // Carregar pedidos ativos e pedidos pagos ao montar o componente
        const carregarPedidos = () => {
            const savedPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
            const savedPaidOrders = JSON.parse(localStorage.getItem('paidOrders')) || [];
            setPedidos(savedPedidos);
            setPaidOrders(savedPaidOrders);
        };

        carregarPedidos();
    }, [pedidosProp]);


    // Abrir botão de filtros
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Fechar botão de filtros
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Abrir modal para visualização do pedido
    const handleOpenModalPedidos = (pedido) => {
        setPedidoSelecionado(pedido);
        setModalPedidosOpen(true);
    };

    // Fechar modal para visualização do pedido
    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
        setPedidoSelecionado(null);
    };

    // Função para atualizar um pedido ativo
    const atualizarPedido = (pedidoAtualizado) => {
        const pedidosAtualizados = pedidos.map(p =>
            p.id === pedidoAtualizado.id ? pedidoAtualizado : p
        );
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
    };

    const deletarPedido = (pedidoId) => {
        const pedidoParaArquivar = pedidos.find(p => p.id === pedidoId);

        if (pedidoParaArquivar) {
            // Remover o pedido da lista de pedidos ativos
            const pedidosAtualizados = pedidos.filter(p => p.id !== pedidoId);
            setPedidos(pedidosAtualizados);
            localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));

            // Adicionar o pedido pago à lista de pedidos arquivados
            const updatedPaidOrders = [...paidOrders, { ...pedidoParaArquivar, pago: true }];
            setPaidOrders(updatedPaidOrders);
            localStorage.setItem('paidOrders', JSON.stringify(updatedPaidOrders));

            // Notificação de sucesso
            notifySuccess(`Pedido de ${pedidoParaArquivar.nomeCliente} arquivado com sucesso.`, "", 3000);
        }
    };


    // Função de pesquisa
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtros
    const handleSwitchChange = (filter) => {
        // Ordem Alfabética
        if (filter === 'alphabetical') {
            setIsAlphabetical(!isAlphabetical);
            setIsMostRecent(false);
            setIsOldest(false);
            // Mais recente
        } else if (filter === 'mostRecent') {
            setIsMostRecent(!isMostRecent);
            setIsAlphabetical(false);
            setIsOldest(false);
            // Mais velho
        } else if (filter === 'oldest') {
            setIsOldest(!isOldest);
            setIsAlphabetical(false);
            setIsMostRecent(false);
            // Já pago
        } else if (filter === 'paid') {
            setIsPaid(!isPaid);
        }
    };

    // Função para funcionamento dos filtros
    const filterAndSortPedidos = () => {
        let filteredPedidos = pedidos.filter(pedido =>
            pedido.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pedido.dataPedido.includes(searchTerm)
        );

        if (isAlphabetical) {
            filteredPedidos = filteredPedidos.sort((a, b) =>
                a.nomeCliente.localeCompare(b.nomeCliente)
            );
        } else if (isMostRecent) {
            filteredPedidos = filteredPedidos.sort((a, b) =>
                new Date(b.dataPedido.split('/').reverse().join('-')) - new Date(a.dataPedido.split('/').reverse().join('-'))
            );
        } else if (isOldest) {
            filteredPedidos = filteredPedidos.sort((a, b) =>
                new Date(a.dataPedido.split('/').reverse().join('-')) - new Date(b.dataPedido.split('/').reverse().join('-'))
            );
        }

        return filteredPedidos;
    };

    // Função para os pedidos já pagos
    // Atualize `displayPedidos` para evitar a exibição de duplicatas
    const displayPedidos = isPaid
    ? paidOrders
    : filterAndSortPedidos().filter(p => !paidOrders.find(pago => pago.id === p.id));
 

    // Função para mudar de página
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        listRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Função para paginação dos pedidos
    const paginatedPedidos = displayPedidos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Função que determina a quantidade de páginas
    const pageCount = Math.ceil(displayPedidos.length / ITEMS_PER_PAGE);

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <div ref={listRef}>
            <div className='flex flex-row justify-between'>
                <input
                    type="text"
                    className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                    placeholder='Pesquisar'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className='text-xl bg-slate-200 w-40 h-12 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'
                >
                    <MdFilterAlt size='40' /> Filtros
                </button>
            </div>
            {displayPedidos.length === 0 ? (
                <div className='flex justify-center items-center text-2xl mt-9'>Nenhum pedido encontrado.</div>
            ) : (
                <div>
                    <div className='flex flex-row justify-between'>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem>
                                <Switch
                                    checked={isAlphabetical}
                                    onChange={() => handleSwitchChange('alphabetical')}
                                    {...label}
                                /> Ordem alfabética
                            </MenuItem>
                            <MenuItem>
                                <Switch
                                    checked={isMostRecent}
                                    onChange={() => handleSwitchChange('mostRecent')}
                                    {...label}
                                /> Mais recente
                            </MenuItem>
                            <MenuItem>
                                <Switch
                                    checked={isOldest}
                                    onChange={() => handleSwitchChange('oldest')}
                                    {...label}
                                /> Mais antigo
                            </MenuItem>
                            <MenuItem>
                                <Switch
                                    checked={isPaid}
                                    onChange={() => handleSwitchChange('paid')}
                                    {...label}
                                /> Pedidos já pagos
                            </MenuItem>
                        </Menu>
                    </div>
                    <div className='grid grid-cols-4 gap-x-4 gap-y-4 p-4'>
                        {paginatedPedidos.map((pedido, index) => (
                            <div key={index} className='bg-gray-100 p-6 rounded-xl shadow-lg'>
                                <div className='flex justify-between'>
                                    <p className='text-xl font-light'>Cliente:</p>
                                    {isPaid ? (
                                        <div className='text-green-500 text-lg flex flex-row'><FaCheck size="28" className="text-green-500 mr-2" />Já pago</div>
                                    ) : (
                                        <Tooltip title="Visualizar pedido">
                                            <button
                                                onClick={() => handleOpenModalPedidos(pedido, index)} // Passe o índice ao abrir o modal
                                                className="text-xl bg-slate-200 w-10 h-8 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-[#3b82f6] hover:text-white"
                                            >
                                                <FaEye />
                                            </button>
                                        </Tooltip>
                                    )}
                                </div>
                                <h1 className='text-3xl mb-5'>{pedido.nomeCliente}</h1>
                                <div className='flex space-x-2'>
                                    <p>Total do pedido:</p>
                                    <p className='font-semibold'>R$ {(pedido.total * 1).toFixed(2)}</p>
                                </div>
                                <div className='flex space-x-2'>
                                    <p>Último pedido feito:</p>
                                    <p className='font-semibold'>{pedido.dataPedido}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center mt-8'>
                        <Stack spacing={2}>
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Stack>
                    </div>
                </div>
            )}
            {pedidoSelecionado && (
                <BasicModal
                    open={modalPedidosOpen}
                    handleClose={handleCloseModalPedidos}
                    pedido={pedidoSelecionado}
                    atualizarPedido={atualizarPedido}
                    deletarPedido={() => deletarPedido(pedidoSelecionado.id)} // Utilize o índice do estado ao deletar
                />
            )}
        </div>
    );
};

export default ResumoPedido;
