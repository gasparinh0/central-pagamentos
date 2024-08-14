import React, { useEffect, useState } from 'react';

//Imports de componentes
import ModalCadastro from "./ModalCadastroCliente";
import ModalCadastroPedido from "./ModalCadastroPedido";

//Imports para funcionamento do backup
import { saveAs } from 'file-saver';
import schedule from 'node-schedule';

//Imports do react-icons
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa";
import { MdBackup } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { FaArrowDownLong } from "react-icons/fa6";

//Import da logo
import logo from '../assets/logo.png';

//Imports do react-toastify
import { notifySuccess } from './ui/Toast';

//Imports do material-ui
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

//Imports do framer-motion (animação)
import { motion } from "framer-motion";

function Navbar({ onClienteCadastrado, onPedidoCadastrado }) {
    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalPedidoOpen, setModalPedidoOpen] = useState(false);
    const [anchorElNovo, setAnchorElNovo] = useState(null);
    const [anchorElBackup, setAnchorElBackup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //Função para importar backup
    useEffect(() => {
        const scheduleBackup = () => {
            const exportData = () => {
                const clients = JSON.parse(localStorage.getItem('clientes')) || [];
                const orders = JSON.parse(localStorage.getItem('pedidos')) || [];
                const paidOrders = JSON.parse(localStorage.getItem('paidOrders')) || [];

                const data = {
                    clients,
                    orders,
                    paidOrders
                };

                const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
                const fileName = `backup_${currentDate}.json`;

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                saveAs(blob, fileName);
                notifySuccess("Backup automático realizado com sucesso.", "", 3000)
            };

            // Schedule backup at 12:00 PM and 5:00 PM
            schedule.scheduleJob('0 12 * * *', exportData);  // At 12:00 PM every day
            schedule.scheduleJob('0 17 * * *', exportData);  // At 5:00 PM every day
        };

        scheduleBackup();

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    //Variáveis para abrir conteúdo dos botões
    const openNovo = Boolean(anchorElNovo);
    const openBackup = Boolean(anchorElBackup);

    //Handle para abrir conteúdo dos botões
    const handleClickNovo = (event) => {
        setAnchorElNovo(event.currentTarget);
    };

    //Handle para fechar conteúdo dos botões
    const handleCloseNovo = () => {
        setAnchorElNovo(null);
    };

    //Handle para abrir conteúdo dos botões
    const handleClickBackup = (event) => {
        setAnchorElBackup(event.currentTarget);
    };

    //Handle para fechar conteúdo dos botões
    const handleCloseBackup = () => {
        setAnchorElBackup(null);
    };

    //Variável para abrir modal de cadastro
    const handleOpenModalCadastro = () => {
        setModalCadastroOpen(true);
    };

    //Handle para fechar modal de cadastro
    const handleCloseModalCadastro = () => {
        setModalCadastroOpen(false);
    };

    //Handle para abrir modal de pedidos
    const handleOpenModalPedido = () => {
        setModalPedidoOpen(true);
    };

    //Handle para fechar modal de pedidos
    const handleCloseModalPedido = () => {
        setModalPedidoOpen(false);
    };

    //Handle para abrir o modal e fechar a aba do botão de clientes
    const handleClickCliente = () => {
        handleCloseNovo()
        handleOpenModalCadastro()
    }

    //Handle para abrir o modal e fechar a aba do botão de pedidos
    const handleClickPedido = () => {
        handleCloseNovo()
        handleOpenModalPedido()
    }

    //Handle para abrir o export e fechar a aba de botão do backup
    const handleClickExport = () => {
        handleCloseBackup()
        exportData()
    }

    //função para exportar backup
    const exportData = () => {
        const clients = JSON.parse(localStorage.getItem('clientes')) || [];
        const orders = JSON.parse(localStorage.getItem('pedidos')) || [];
        const paidOrders = JSON.parse(localStorage.getItem('paidOrders')) || [];

        const data = {
            clients,
            orders,
            paidOrders
        };

        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const fileName = `backup_${currentDate}.json`;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        saveAs(blob, fileName);
        notifySuccess("Backup salvo com sucesso", "", 3000);
    };

    //Função para importar backup
    const importData = (event) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const jsonData = JSON.parse(e.target.result);
            localStorage.setItem('clientes', JSON.stringify(jsonData.clients));
            localStorage.setItem('pedidos', JSON.stringify(jsonData.orders));
            localStorage.setItem('paidOrders', JSON.stringify(jsonData.paidOrders));
            alert('Backup restaurado com sucesso!');
            // Atualiza a página para refletir os dados importados
            window.location.reload();
        };
        fileReader.readAsText(event.target.files[0]);
    };

    return (
        <div className="bg-white shadow shadow-gray-300 p-3">
            {isLoading ? (
                <div className="flex justify-between items-center">
                    {/* Logo e texto */}
                    <div className='flex items-center'>
                        <Skeleton variant="circular" width={64} height={64} />
                        <div className='flex flex-col ml-3'>
                            <Skeleton variant="text" width={200} height={40} />
                        </div>
                    </div>

                    {/* Botões centralizados */}
                    <div className='flex space-x-8 mr-24 items-center'>
                        <Skeleton variant="rectangular" width={160} height={48} className="rounded-2xl" />
                        <Skeleton variant="rectangular" width={160} height={48} className="rounded-2xl" />
                    </div>

                    {/* Ícones à direita */}
                    <div className='flex space-x-9 mr-8'>
                        <Skeleton variant="rectangular" width={100} height={50} className="rounded-2xl" />
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center"
                >
                    {/* Logo e texto */}
                    <div className='flex items-center'>
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                        <div className='flex flex-col ml-3'>
                            <h1 className='text-xl'>Central do crediário</h1>
                        </div>
                    </div>

                    {/* Botões centralizados */}
                    <div className='flex space-x-8 mr-24 items-center'>
                        <button
                            id="novo-button"
                            aria-controls={openNovo ? 'novo-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openNovo ? 'true' : undefined}
                            onClick={handleClickNovo}
                            className='text-xl bg-slate-200 w-40 h-12 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:bg-[#3b82f6] hover:text-white hover:w-44 hover:h-14'
                        >
                            <FiPlusCircle className='mr-2' />Novo
                        </button>
                        <Menu
                            id="novo-menu"
                            anchorEl={anchorElNovo}
                            open={openNovo}
                            onClose={handleCloseNovo}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            MenuListProps={{
                                'aria-labelledby': 'novo-button',
                            }}
                            className='mt-2 flex justify-center items-center'
                        >
                            <MenuItem onClick={handleClickCliente}><IoPersonSharp className='mr-3' />Cliente</MenuItem>
                            <MenuItem onClick={handleClickPedido}><FaCartPlus className='mr-3' />Pedido</MenuItem>
                        </Menu>

                        <button
                            id="backup-button"
                            aria-controls={openBackup ? 'backup-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openBackup ? 'true' : undefined}
                            onClick={handleClickBackup}
                            className='text-xl bg-slate-200 w-40 h-12 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 hover:bg-[#3b82f6] hover:text-white hover:w-44 hover:h-14'
                        >
                            <MdBackup className='mr-2' />Backup
                        </button>
                        <Menu
                            id="backup-menu"
                            anchorEl={anchorElBackup}
                            open={openBackup}
                            onClose={handleCloseBackup}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            MenuListProps={{
                                'aria-labelledby': 'backup-button',
                            }}
                            className='mt-2 flex justify-center items-center'
                        >
                            <MenuItem>
                                <label htmlFor="import-backup" className="flex items-center cursor-pointer">
                                    <FaArrowDownLong className='mr-3' />
                                    Importar backup
                                    <input
                                        type="file"
                                        accept=".json"
                                        id="import-backup"
                                        onChange={importData}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </MenuItem>
                            <MenuItem onClick={handleClickExport}><MdBackup className='mr-3' />Exportar backup</MenuItem>
                        </Menu>
                    </div>
                    {/* Ícones à direita */}
                    <div className='flex space-x-9 mr-8'>
                        {isLoading ? (
                            <Skeleton variant="rectangular" width={100} height={50} className="rounded-2xl" />
                        ) : (
                            <div>
                                <Tooltip title="Em breve!">
                                    <div className='flex flex-col justify-center text-neutral-700 items-center transition-colors duration-300 hover:text-orange-600'>
                                        <FaRegQuestionCircle size='30' />
                                        <p className='text-xl'>Dúvidas</p>
                                    </div>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            <ModalCadastro open={modalCadastroOpen} handleClose={handleCloseModalCadastro} onClienteCadastrado={onClienteCadastrado} />
            <ModalCadastroPedido
                open={modalPedidoOpen}
                handleClose={handleCloseModalPedido}
                onPedidoCadastrado={onPedidoCadastrado}
            />
        </div>
    );
}

export default Navbar;
