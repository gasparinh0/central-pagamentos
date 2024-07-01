import React, { useEffect, useState } from 'react';
import { TbPigMoney } from "react-icons/tb";
import ModalCadastro from "./ModalCadastroCliente";
import ModalCadastroPedido from "./ModalCadastroPedido";
import { saveAs } from 'file-saver';
import schedule from 'node-schedule';

function Navbar({ onClienteCadastrado, onPedidoCadastrado }) {
    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalPedidoOpen, setModalPedidoOpen] = useState(false);

    useEffect(() => {
        const scheduleBackup = () => {
            const exportData = () => {
                const clients = JSON.parse(localStorage.getItem('clientes')) || [];
                const orders = JSON.parse(localStorage.getItem('pedidos')) || [];

                const data = {
                    clients,
                    orders
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

        const data = {
            clients,
            orders
        };

        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const fileName = `backup_${currentDate}.json`;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        saveAs(blob, fileName);
    };

    const importData = (event) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const jsonData = JSON.parse(e.target.result);
            localStorage.setItem('clientes', JSON.stringify(jsonData.clients));
            localStorage.setItem('pedidos', JSON.stringify(jsonData.orders));
            alert('Backup restaurado com sucesso!');
            // Atualiza a página para refletir os dados importados
            window.location.reload();
        };
        fileReader.readAsText(event.target.files[0]);
    };

    return (
        <div className="flex p-8 bg-slate-200">
            <div className="bg-slate-400 p-2 mr-3 content-none rounded-full">
                <TbPigMoney size={60} />
            </div>
            <div>
                <h1 className="text-3xl">Central do fiado</h1>
                <p className="text-2xl font-light">Bem vindo!</p>
            </div>
            <div className="flex ml-auto">
                <button
                    onClick={handleOpenModalCadastro}
                    className="bg-slate-400 mr-8 text-2xl p-3 rounded-full"
                >
                    Cadastrar cliente
                </button>

                <button
                    onClick={handleOpenModalPedido}
                    className="bg-slate-400 mr-8 text-2xl p-3 rounded-full"
                >
                    Cadastrar Pedido
                </button>

                <button
                    onClick={exportData}
                    className="bg-slate-400 mr-8 text-2xl p-3 rounded-full"
                >
                    Exportar Backup
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
                    className="bg-slate-400 text-2xl p-3 rounded-full cursor-pointer"
                >
                    Importar Backup
                </label>
            </div>
            <ModalCadastro open={modalCadastroOpen} handleClose={handleCloseModalCadastro} onClienteCadastrado={onClienteCadastrado}/>
            <ModalCadastroPedido
                open={modalPedidoOpen}
                handleClose={handleCloseModalPedido}
                onPedidoCadastrado={onPedidoCadastrado}
            />
        </div>
    );
}

export default Navbar;
