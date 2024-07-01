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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const steps = ['Informações do Cliente', 'Produtos e Preços', 'Resumo do Pedido'];

const ModalCadastroPedido = ({ open, handleClose, onPedidoCadastrado }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [nomeCliente, setNomeCliente] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [produtos, setProdutos] = useState([{ nome: '', preco: '' }]);
    const [total, setTotal] = useState(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const novoTotal = produtos.reduce((acc, produto) => acc + parseFloat(produto.preco || 0), 0);
        setTotal(novoTotal);
    }, [produtos]);

    const componentRef = useRef(null);

    const handleAddProduto = () => {
        setProdutos([...produtos, { nome: '', preco: 0 }]);
    };

    const handleChangeProduto = (index, key, value) => {
        const newProdutos = [...produtos];
        newProdutos[index][key] = value;
        setProdutos(newProdutos);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

        // Limpar os campos após salvar
        setNomeCliente('');
        setDataPedido('');
        setProdutos([{ nome: '', preco: 0 }]);
        setTotal(0);

        // Mostrar a mensagem de sucesso e fechar o modal após 3 segundos
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
            handleClose();
            handleReset();
        }, 3000);
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
                    <h1 className='text-3xl'>Cadastrar pedido</h1>
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
                        <div className='flex flex-col'>
                            <p>Nome do cliente:</p>
                            <input
                                type="text"
                                value={nomeCliente}
                                onChange={(e) => setNomeCliente(e.target.value)}
                                className='border-gray-950 bg-slate-200 w-48'
                            />
                            <p>Data do pedido:</p>
                            <input
                                type="date"
                                value={dataPedido}
                                onChange={handleDataPedidoChange}
                                className='border-gray-950 bg-slate-200 w-48'
                            />
                        </div>
                    )}
                    {activeStep === 1 && (
                        <div className='flex flex-col space-y-3 mt-3'>
                            <p>Produtos e Preços:</p>
                            {produtos.map((produto, index) => (
                                <div key={index} className='flex flex-row space-x-3'>
                                    <input
                                        type="text"
                                        placeholder="Produto"
                                        value={produto.nome}
                                        onChange={(e) => handleChangeProduto(index, 'nome', e.target.value)}
                                        className='border-gray-950 bg-slate-200 w-48'
                                    />
                                    <input
                                        type="text"
                                        placeholder="Preço"
                                        value={produto.preco}
                                        onChange={(e) => handleChangeProduto(index, 'preco', e.target.value)}
                                        className='border-gray-950 bg-slate-200 w-24'
                                    />
                                    {index === 0 && (
                                        <button onClick={handleAddProduto} className='bg-slate-400 text-xs'>
                                            Adicionar produto
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {activeStep === 2 && (
                        <div className='flex flex-col justify-center items-center space-y-3 mt-3'>
                            <h1>Nota do pedido</h1>
                            <div className='border border-black p-12'>
                                <div ref={componentRef} className='flex flex-col items-start font-bold'>
                                    <div className='flex flex-col items-start'>
                                        <h1>Autorização p/ faturamento</h1>
                                        <hr></hr>
                                        <p>Cliente: {nomeCliente}</p>
                                    </div>
                                    <div className='content-none bg-black w-96 h-0.5 mt-2 mb-2 opacity-50'></div>
                                    <p>Produtos:</p>
                                    {produtos.map((produto, index) => (
                                        <div key={index}>
                                            <p>{produto.nome} - R$ {produto.preco}</p>
                                        </div>
                                    ))}
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
                                trigger={() => <button className='bg-slate-400 mt-2 p-4 rounded-full text-2xl'>Imprimir</button>}
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
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={activeStep === steps.length - 1 ? handleSave : handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Typography>
                {showSuccessMessage && (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Cadastro realizado com sucesso!
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default ModalCadastroPedido;
