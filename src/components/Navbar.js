import { useState } from "react";
import { TbPigMoney } from "react-icons/tb";
import ModalCadastro from "./ModalCadastroCliente";
import ModalCadastroPedido from "./ModalCadastroPedido";

function Navbar({ onClienteCadastrado, onPedidoCadastrado }) {
    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalPedidoOpen, setModalPedidoOpen] = useState(false);

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
            </div>
            <ModalCadastro open={modalCadastroOpen} handleClose={handleCloseModalCadastro} />
            <ModalCadastroPedido
                open={modalPedidoOpen}
                handleClose={handleCloseModalPedido}
                onPedidoCadastrado={onPedidoCadastrado}
            />
        </div>
    );
}

export default Navbar;
