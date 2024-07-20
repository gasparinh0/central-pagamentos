import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import BasicModal from "../components/ModalPedidos";
import { MdFilterAlt } from "react-icons/md";
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ITEMS_PER_PAGE = 12;

const ResumoPedido = ({ pedidosProp, onDelete }) => {
    const [pedidos, setPedidos] = useState(pedidosProp || []);
    const [modalPedidosOpen, setModalPedidosOpen] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [pedidoIndexSelecionado, setPedidoIndexSelecionado] = useState(null); // Novo estado para armazenar o índice do pedido selecionado
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
        if (pedidosProp) {
            setPedidos(pedidosProp);
        } else {
            const savedPedidos = localStorage.getItem('pedidos');
            if (savedPedidos) {
                setPedidos(JSON.parse(savedPedidos));
            }
        }
    }, [pedidosProp]);

    useEffect(() => {
        const savedPaidOrders = localStorage.getItem('paidOrders');
        if (!savedPaidOrders) {
            localStorage.setItem('paidOrders', JSON.stringify([]));
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenModalPedidos = (pedido, index) => {
        setPedidoSelecionado(pedido);
        setPedidoIndexSelecionado(index); // Armazene o índice do pedido selecionado
        setModalPedidosOpen(true);
    };

    const handleCloseModalPedidos = () => {
        setModalPedidosOpen(false);
        setPedidoSelecionado(null);
        setPedidoIndexSelecionado(null); // Limpe o índice do pedido selecionado
    };

    const atualizarPedido = (pedidoAtualizado) => {
        const pedidosAtualizados = pedidos.map(p => p.nomeCliente === pedidoAtualizado.nomeCliente ? pedidoAtualizado : p);
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
    };

    const deletarPedido = (index) => {
        const pedidosAtualizados = pedidos.filter((_, i) => i !== index);
        const pedidoRemovido = pedidos[index];
        setPedidos(pedidosAtualizados);
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));

        const savedPaidOrders = JSON.parse(localStorage.getItem('paidOrders'));
        savedPaidOrders.push(pedidoRemovido);
        localStorage.setItem('paidOrders', JSON.stringify(savedPaidOrders));

        if (onDelete) {
            onDelete(index);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSwitchChange = (filter) => {
        if (filter === 'alphabetical') {
            setIsAlphabetical(!isAlphabetical);
            setIsMostRecent(false);
            setIsOldest(false);
        } else if (filter === 'mostRecent') {
            setIsMostRecent(!isMostRecent);
            setIsAlphabetical(false);
            setIsOldest(false);
        } else if (filter === 'oldest') {
            setIsOldest(!isOldest);
            setIsAlphabetical(false);
            setIsMostRecent(false);
        } else if (filter === 'paid') {
            setIsPaid(!isPaid);
        }
    };

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

    const displayPedidos = isPaid ? JSON.parse(localStorage.getItem('paidOrders')) : filterAndSortPedidos();

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        listRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const paginatedPedidos = displayPedidos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MdFilterAlt size='40' /> Filtros
                </Button>
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
            {displayPedidos.length === 0 ? (
                <div className='flex justify-center items-center text-2xl mt-9'>Nenhum pedido encontrado.</div>
            ) : (
                <div className='grid grid-cols-4 gap-x-4 gap-y-4 p-4'>
                    {paginatedPedidos.map((pedido, index) => (
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
                            {isPaid ? (
                                <div className='text-green-500 text-lg mt-4'>Já pago</div>
                            ) : (
                                <button
                                    onClick={() => handleOpenModalPedidos(pedido, index)} // Passe o índice ao abrir o modal
                                    className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-lg p-3 mt-3 h-12 w-40 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center justify-center"
                                >
                                    Visualizar
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {pedidoSelecionado && (
                <BasicModal
                    open={modalPedidosOpen}
                    handleClose={handleCloseModalPedidos}
                    pedido={pedidoSelecionado}
                    atualizarPedido={atualizarPedido}
                    deletarPedido={() => deletarPedido(pedidoIndexSelecionado)} // Utilize o índice do estado ao deletar
                />
            )}
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
    );
};

export default ResumoPedido;
