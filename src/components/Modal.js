import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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

const BasicModal = ({ open, handleClose }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <h1 className='text-3xl'>Nome do cliente</h1>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <div className='grid grid-cols-2'>
                        <div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Total do pedido:</p>
                                <p>R$100</p>
                            </div>
                            <div className='flex space-x-2 text-2xl'>
                                <p>Último pedido feito:</p>
                                <p>23/06/2019</p>
                            </div>
                            <p className='mt-3'>Produtos obtidos:</p>
                            <ul className='list-disc list-inside ml-5'>
                                <li>oi</li>
                                <li>oi</li>
                                <li>oi</li>
                                <li>oi</li>
                            </ul>
                        </div>
                        <div>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>Acrescentar produto</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div className='flex flex-col justify-start'>
                                            <p>Nome do produto</p>
                                            <input type="text" className='border-gray-950 bg-slate-200'></input>
                                            <p>Data:</p>
                                            <input type="text" className='border-gray-950 bg-slate-200'></input>
                                            <p>Preço</p>
                                            <input type="text" className='border-gray-950 bg-slate-200'></input>
                                            <button className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'>Acrescentar</button>
                                        </div>

                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography>Abater valor</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <p>Valor para abater</p>
                                        <input type="text" className='border-gray-950 bg-slate-200'></input>
                                        <button className='mt-3 bg-slate-200 p-2 w-56 rounded-xl'>Abater</button>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <button className='bg-slate-400 mt-2 p-4 rounded-full text-2xl'> Apagar</button>
                        </div>
                    </div>
                </Typography>
            </Box>
        </Modal>
    );
};

export default BasicModal;
