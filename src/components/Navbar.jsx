import React, { useEffect, useState } from 'react';
import ModalCadastro from "./ModalCadastroCliente";
import ModalCadastroPedido from "./ModalCadastroPedido";
import { saveAs } from 'file-saver';
import schedule from 'node-schedule';
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa";
import { MdBackup } from "react-icons/md";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import logo from '../assets/logo.png';
import { notifySuccess } from './ui/Toast';

function Navbar({ onClienteCadastrado, onPedidoCadastrado }) {
    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalPedidoOpen, setModalPedidoOpen] = useState(false);

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
            };

            // Schedule backup at 12:00 PM and 5:00 PM
            schedule.scheduleJob('0 12 * * *', exportData);  // At 12:00 PM every day
            schedule.scheduleJob('0 17 * * *', exportData);  // At 5:00 PM every day
        };

        scheduleBackup();
    }, []);

    const handleOpenModalCadastro = () => {
        setModalCadastroOpen(true);
    };

    const handleCloseModalCadastro = () => {
        setModalCadastroOpen(false);
    };

    const handleOpenModalPedido = () => {
        setModalPedidoOpen(true);
    };

    const handleCloseModalPedido = () => {
        setModalPedidoOpen(false);
    };

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
        notifySuccess("Backup salvo com sucesso","",3000)
    };

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
        <div className="flex justify-between bg-gray-200 shadow shadow-gray-300 p-7 items-center">
            {/* Logo e texto */}
            <div className='flex items-center'>
                <img src={logo} alt="Logo" className="w-20 h-20" />
                <div className='flex flex-col ml-3'>
                    <h1 className='text-2xl'>Central do crediário</h1>
                    <p className='text-xl font-light'>Bem vindo!</p>
                </div>
            </div>

            {/* Botões centralizados */}
            <div className='flex space-x-8 mr-24'>
                <button
                    onClick={handleOpenModalCadastro}
                    className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center"
                >
                    <IoPersonSharp className="mr-2 hover:text-white"/> Cadastrar cliente
                </button>

                <button
                    onClick={handleOpenModalPedido}
                    className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center"
                >
                    <FaCartPlus className='mr-2  hover:text-white' /> Cadastrar Pedido
                </button>

                <button
                    onClick={exportData}
                    className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6]  hover:text-white flex items-center"
                >
                    <MdBackup className='mr-2  hover:text-white' /> Exportar Backup
                </button>
                <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{ display: 'none' }}
                    id="import-backup"
                />
                <label
                    htmlFor="import-backup"
                    className="bg-[#e7e7e7] border-[#3b82f6] border-2 text-2xl p-3 rounded-2xl transition-colors duration-300 shadow-lg cursor-pointer hover:bg-[#3b82f6]  hover:text-white flex items-center"
                >
                    <FaArrowDownLong className='mr-2  hover:text-white' /> Importar Backup
                </label>
            </div>

            {/* Ícones à direita */}
            <div className='flex space-x-10'>
                <div className='flex flex-col justify-center items-center transition-colors duration-300 hover:text-orange-600'>
                    <a href='https://www.youtube.com/' className='flex flex-col justify-center items-center'>
                        <FaRegQuestionCircle size='40' />
                        <p className='text-xl'>Dúvidas</p>
                    </a>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <a href='https://www.youtube.com/' className='flex flex-col justify-center items-center transition-colors duration-300 hover:text-yellow-400'>
                        <FaStar size='40' />
                        <p className='text-xl'>Avalie</p>
                    </a>
                </div>
            </div>

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
