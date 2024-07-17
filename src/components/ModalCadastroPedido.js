import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { ReactToPrint } from 'react-to-print';
import { MdKeyboardReturn } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const getModalWidth = (activeStep) => {
    let widthCustom = '40%'; // Default minimum height
    if (activeStep === 0) {
        widthCustom = '20%'; // Altura mínima para o step 0
    } else if (activeStep === 1) {
        widthCustom = '30%'; // Altura mínima para o step 1
    } else if (activeStep === 2) {
        widthCustom = '30%'; // Altura mínima para o step 2
    }
    return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: widthCustom,
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '15px',
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
    };
};

const steps = ['Informações do Cliente', 'Produtos e Preços', 'Resumo do Pedido'];

const ModalCadastroPedido = ({ open, handleClose, onPedidoCadastrado }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [nomeCliente, setNomeCliente] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [produtos, setProdutos] = useState([{ nome: '', preco: '', quantidade: '' }]);
    const [total, setTotal] = useState(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [buttonHidden, setButtonHidden] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const storedClientes = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(storedClientes);
    }, []);

    useEffect(() => {
        const novoTotal = produtos.reduce((acc, produto) => acc + (parseFloat(produto.preco || 0) * parseInt(produto.quantidade || 0)), 0);
        setTotal(novoTotal);
    }, [produtos]);

    const componentRef = useRef(null);

    const handleAddProduto = () => {
        setProdutos([...produtos, { nome: '', preco: '', quantidade: '' }]);
    };

    const handleChangeProduto = (index, key, value) => {
        const newProdutos = [...produtos];
        newProdutos[index][key] = value.replace(',', '.');
        setProdutos(newProdutos);
    };

    const handleNext = () => {
        if (validateInputs()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const formatarData = (data) => {
        if (data) {
            const partesData = data.split('-');
            return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        }
        return '';
    };

    const handleDataPedidoChange = (e) => {
        const data = e.target.value;
        setDataPedido(data);
        const novaData = addDays(data, 30);
        setDataVencimento(formatarData(novaData.toISOString().split('T')[0]));
    };

    const handleSave = () => {
        const pedido = {
            nomeCliente,
            dataPedido: formatarData(dataPedido),
            novaData: dataVencimento,
            produtos,
            total,
        };

        const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
        pedidosSalvos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidosSalvos));
        onPedidoCadastrado(pedido);

        setNomeCliente('');
        setDataPedido('');
        setProdutos([{ nome: '', preco: '', quantidade: '' }]);
        setTotal(0);

        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
            handleClose();
            handleReset();
            setButtonHidden(false);
        }, 3000);

        setButtonHidden(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
                e.preventDefault();
            } else {
                if (activeStep === steps.length - 1) {
                    handleSave();
                } else {
                    handleNext();
                }
            }
        }
    };

    const validateInputs = () => {
        if (activeStep === 0) {
            return nomeCliente && dataPedido;
        } else if (activeStep === 1) {
            return produtos.every(produto => produto.nome && produto.preco && produto.quantidade);
        }
        return true;
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={getModalWidth(activeStep)}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <div className='flex justify-between'>
                        <div className='content-none w-2'></div>
                        <h1 className='text-3xl mb-6'>Cadastrar pedido</h1>
                        <IoIosCloseCircle size="35" onClick={handleClose} style={{ cursor: 'pointer' }} color='#dc2626' />
                    </div>
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {activeStep === 0 && (
                        <form className='flex flex-col'>
                            <p>Nome do cliente:</p>
                            <Autocomplete
                                options={clientes.slice(0, 5).map(cliente => cliente.nome)}
                                noOptionsText="Nenhum cliente encontrado"
                                value={nomeCliente}
                                onChange={(event, newValue) => {
                                    setNomeCliente(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Selecione o cliente"
                                        className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                        onKeyDown={handleKeyDown}
                                        style={{ width: '50%'}}
                                    />
                                )}
                            />
                            <p className='mt-3'>Data do pedido:</p>
                            <input
                                type="date"
                                value={dataPedido}
                                onChange={handleDataPedidoChange}
                                className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                onKeyDown={handleKeyDown}
                            />
                        </form>
                    )}
                    {activeStep === 1 && (
                        <form className='flex flex-col space-y-3 mt-3'>
                            <p>Produtos, Preço e Quantidade:</p>
                            {produtos.map((produto, index) => (
                                <div key={index} className='flex flex-row space-x-3'>
                                    <input
                                        type="text"
                                        placeholder="Produto"
                                        value={produto.nome}
                                        maxLength='50'
                                        onChange={(e) => handleChangeProduto(index, 'nome', e.target.value)}
                                        className='w-56 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                        onKeyDown={handleKeyDown}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Preço"
                                        maxLength='20'
                                        value={produto.preco}
                                        onChange={(e) => handleChangeProduto(index, 'preco', e.target.value)}
                                        className='w-28 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                        onKeyDown={handleKeyDown}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantidade"
                                        value={produto.quantidade}
                                        onChange={(e) => handleChangeProduto(index, 'quantidade', e.target.value)}
                                        className='w-20 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                        onKeyDown={handleKeyDown}
                                    />
                                    {index === 0 && (
                                        <button
                                            type="button"
                                            onClick={handleAddProduto}
                                            className='bg-[#e7e7e7] border-[#3b82f6] border-2 text-xs p-3 rounded-2xl transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center'
                                        >
                                            Adicionar produto
                                        </button>
                                    )}
                                </div>
                            ))}
                        </form>
                    )}
                    {activeStep === 2 && (
                        <div className='flex flex-col justify-center items-center space-y-3 mt-3'>
                            <h1>Nota do pedido</h1>
                            <div className='border border-black p-8'>
                                <div ref={componentRef} className='flex flex-col items-start font-bold'>
                                    <div className='flex flex-col items-start'>
                                        <h1>Autorização p/ faturamento</h1>
                                        <hr></hr>
                                        <p>Cliente: {nomeCliente}</p>
                                    </div>
                                    <div className='content-none bg-black w-96 h-0.5 mt-2 mb-2 opacity-50'></div>
                                    <p className='mb-2'>Produtos adquiridos:</p>
                                    <div className='flex flex-col items-start'>
                                        <div className='flex flex-row space-x-1'>
                                            <p className='w-40'>Produto</p>
                                            <p className='w-20'>Qtd</p>
                                            <p className='w-20'>R$</p>
                                        </div>
                                        <div className='mt-2'>
                                            {produtos.map((produto, index) => (
                                                <div key={index} className='flex flex-row space-x-1'>
                                                    <p className='w-40'>{produto.nome}</p>
                                                    <p className='w-20'>{produto.quantidade}</p>
                                                    <p className='w-20'>{produto.preco}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-xl'>Valor total: R$ {total.toFixed(2)}</p>
                                    </div>
                                    <div className='w-72 flex flex-col items-start justify-center'>
                                        <p className='mt-3'>Eu concordo que, ao assinar essa nota, me comprometo a pagar o valor citado no prazo de 30 dias.</p>
                                        <div className='content-none bg-black w-48 h-0.5 mt-24 mb-2'></div>
                                        <p>Assinatura</p>
                                        <p className='mt-3'>Data do pedido: {formatarData(dataPedido)}</p>
                                        <p>Data de vencimento: {dataVencimento}</p>
                                    </div>
                                </div>
                            </div>
                            <ReactToPrint
                                trigger={() => <button className='bg-[#e7e7e7] border-[#3b82f6] border-2 text-xl p-3 rounded-2xl w-40 transition-colors duration-300 shadow-lg hover:bg-[#3b82f6] hover:text-white flex items-center justify-center'>Imprimir</button>}
                                content={() => componentRef.current}
                                pageStyle="print"
                            />
                        </div>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            <MdKeyboardReturn className='mr-2' /> Voltar
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {!buttonHidden && (
                            <Button onClick={activeStep === steps.length - 1 ? handleSave : handleNext}>
                                {activeStep === steps.length - 1 ? 'Cadastrar' : 'Próximo'}
                            </Button>
                        )}
                    </Box>
                </Typography>
                {showSuccessMessage && (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        <p className='text-green-500 text-xl flex justify-center'>Cadastro finalizado com sucesso!</p>
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ModalCadastroPedido;
