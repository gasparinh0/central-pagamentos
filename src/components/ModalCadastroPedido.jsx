import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

//Imports do material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

//Imports do react-icons
import { MdKeyboardReturn } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

//Imports do React-Print (imprimir tela)
import { ReactToPrint } from 'react-to-print';

//Imports do React-Toastify (notificação de sucesso)
import { notifySuccess } from './ui/Toast';

//Imports do brazilian-values (formatação de números)
import { formatToBRL } from "brazilian-values"

//Código para determinar o width do modal a partir dos steps
const getModalWidth = (activeStep) => {
    let widthCustom = '40%'; // Default minimum height
    if (activeStep === 0) {
        widthCustom = '20%'; // Altura mínima para o step 0
    } else if (activeStep === 1) {
        widthCustom = '28%'; // Altura mínima para o step 1
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

//Steps do modal
const steps = ['Informações do Cliente', 'Produtos e Preços', 'Resumo do Pedido'];

const ModalCadastroPedido = ({ open, handleClose, onPedidoCadastrado }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [nomeCliente, setNomeCliente] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [produtos, setProdutos] = useState([{ nome: '', preco: '', quantidade: '' }]);
    const [total, setTotal] = useState(0);
    const [buttonHidden, setButtonHidden] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);

    //Código para obter a lista de clientes
    useEffect(() => {
        const storedClientes = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(storedClientes);
    }, []);

    //Código para determinar o total do pedido
    useEffect(() => {
        const novoTotal = produtos.reduce((acc, produto) => acc + (parseFloat(produto.preco || 0) * parseInt(produto.quantidade || 0)), 0);
        setTotal(novoTotal);
    }, [produtos]);

    //Código para obter a lista de clientes
    useEffect(() => {
        const storedClientes = JSON.parse(localStorage.getItem('clientes')) || [];
        setClientes(storedClientes);
    }, [localStorage.getItem('clientes')]);

    //Código para funcionamento do React-Print
    const componentRef = useRef(null);

    //Handle para adicionar produtos
    const handleAddProduto = () => {
        setProdutos([...produtos, { nome: '', preco: '', quantidade: '' }]);
    };

    //Handle para mudar a virgula para ponto (facilitar a conta)
    const handleChangeProduto = (index, key, value) => {
        const newProdutos = [...produtos];
        newProdutos[index][key] = value.replace(',', '.');
        setProdutos(newProdutos);
    };

    //Handle para prosseguir no modal
    const handleNext = () => {
        if (validateInputs()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    //Handle para voltar no Modal
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //Handle para resetar o modal
    const handleReset = () => {
        setActiveStep(0);
    };

    //Handle para determinar a data de validade do pedido
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    //Handle para formatar dados
    const formatarData = (data) => {
        if (data) {
            const partesData = data.split('-');
            return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        }
        return '';
    };

    //Handle para data
    const handleDataPedidoChange = (e) => {
        const data = e.target.value;
        setDataPedido(data);
        const novaData = addDays(data, 30);
        setDataVencimento(formatarData(novaData.toISOString().split('T')[0]));
    };

    //Handle para salvar o pedido
    const handleSave = async () => {
        setButtonHidden(true);

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



        notifySuccess("Pedido salvo com sucesso", "", 3000)

        handleClose();
        handleReset();
        setButtonHidden(false);

    };

    //Handle para prosseguir com o enter
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

    //Validação de inputs
    const validateInputs = () => {
        if (activeStep === 0) {
            return nomeCliente && dataPedido;
        } else if (activeStep === 1) {
            return produtos.every(produto => produto.nome && produto.preco && produto.quantidade);
        }
        return true;
    };

    //Limitar o Autocomplete de mostrar todos os clientes e apenas os 5 primeiros
    const handleFilterClientes = (event) => {
        const value = event.target.value.toLowerCase();
        const filtered = clientes.filter(cliente => cliente.nome.toLowerCase().includes(value));
        setClientesFiltrados(filtered);
    };

    //Código que complementa o código acima
    useEffect(() => {
        setClientesFiltrados(clientes.slice(0, 5));
    }, [clientes]);

    //Handle para remover o produto na hora de adicionar
    const handleRemoveProduto = (index) => {
        const newProdutos = [...produtos];
        newProdutos.splice(index, 1);
        setProdutos(newProdutos);
    };

    //Handle para tirar o R$ do valor formatado
    function formatPriceWithoutCurrency(value) {
        // Remove "R$" da string formatada
        const formattedValue = formatToBRL(value);
        const valueWithoutCurrency = formattedValue.replace('R$', '').trim();
        
        return valueWithoutCurrency;
      }


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
                                options={clientesFiltrados.map(cliente => cliente.nome)}
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
                                        onChange={handleFilterClientes}
                                        style={{ width: '70%' }}
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
                        <form className='flex flex-col'>
                            {produtos.map((produto, index) => (
                                <div key={index} className='flex space-x-2 mb-4 items-center justify-start'>
                                    <div className=''>
                                        <p>Produto:</p>
                                        <input
                                            type="text"
                                            value={produto.nome}
                                            onChange={(e) => handleChangeProduto(index, 'nome', e.target.value)}
                                            className='w-52 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className=''>
                                        <p>Preço:</p>
                                        <input
                                            type="text"
                                            value={produto.preco}
                                            onChange={(e) => handleChangeProduto(index, 'preco', e.target.value)}
                                            className='w-20 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className=''>
                                        <p>Qtd:</p>
                                        <input
                                            type="text"
                                            value={produto.quantidade}
                                            onChange={(e) => handleChangeProduto(index, 'quantidade', e.target.value)}
                                            className='w-14 px-3 py-1.5 text-base font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/25'
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className=''>
                                        <p>Subtotal</p>
                                        <div className='w-auto px-3 py-1.5 text-base font-normal leading-6 flex justify-center items-center text-gray-900 bg-white border border-gray-300 rounded-md'>
                                            <p>{produto.quantidade * produto.preco}</p>
                                        </div>
                                    </div>
                                    {index > 0 && (
                                        <div className='text-neutral-700 transition-all duration-300 hover:text-red-500'>
                                            <IoIosCloseCircle
                                                size="25"
                                                onClick={() => handleRemoveProduto(index)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button variant="contained" color="primary" onClick={handleAddProduto}>
                                Adicionar Produto
                            </Button>
                        </form>
                    )}
                    {activeStep === 2 && (
                        <div className='flex flex-col justify-center items-center space-y-3 mt-3'>
                            <h1>Nota do pedido</h1>
                            <div className='border border-black p-8'>
                                <div ref={componentRef} className='flex flex-col items-start font-bold printableContent'>
                                    <div className='flex flex-col items-start'>
                                        <h1>Autorização p/ faturamento</h1>
                                        <hr></hr>
                                        <p>Cliente: {nomeCliente}</p>
                                    </div>
                                    <div className='content-none bg-black w-96 h-0.5 mt-2 mb-2 opacity-50'></div>
                                    <p className='mb-2'>Produtos adquiridos:</p>
                                    <div className='flex flex-col items-start'>
                                        <div className='flex flex-row space-x-1'>
                                            <p className='w-28'>Produto</p>
                                            <p className='w-10'>Qtd</p>
                                            <p className='w-16'>R$</p>
                                            <p>Subtotal</p>
                                        </div>
                                        <div className='mt-2'>
                                            {produtos.map((produto, index) => (
                                                <div key={index} className='flex flex-row space-x-1'>
                                                    <p className='w-28'>{produto.nome}</p>
                                                    <p className='w-10'>{produto.quantidade}</p>
                                                    <p className='w-16'>{formatPriceWithoutCurrency(produto.preco)}</p>
                                                    <p>{formatPriceWithoutCurrency(produto.quantidade * produto.preco)}</p>
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
                                trigger={() => <button className='text-xl bg-slate-200 mt-3 w-40 h-10 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-300 text-neutral-700 hover:bg-slate-100'>Imprimir</button>}
                                content={() => componentRef.current}
                                pageStyle="print"
                            />
                        </div>
                    )}
                    <div className="mt-4 flex justify-between">
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            <MdKeyboardReturn className='mr-2' /> Voltar
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" color="primary" onClick={handleSave} disabled={buttonHidden}>
                                Salvar
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                Próximo
                            </Button>
                        )}
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
};

export default ModalCadastroPedido;
