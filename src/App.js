//Import do CSS
import './App.css';

//Import do react-icons
import { TbPigMoney } from "react-icons/tb";



function App() {
  return (
<div className="flex p-8 bg-slate-200">
  <div className='bg-slate-400 p-2 mr-3 content-none rounded-full'>
    <TbPigMoney size={60}/>
  </div>
  <div>
    <h1 className='text-3xl'>Central do fiado</h1>
    <p className='text-2xl font-light'>Bem vindo!</p>
  </div>
  <div className='flex ml-auto'>
    <div className='bg-slate-400 mr-8 flex justify-center align-middle items-center p-4 rounded-full'>
      <h1 className='text-3xl'>Cadastrar cliente</h1>
    </div>
    <div className='bg-slate-400 mr-8 flex justify-center align-middle items-center p-4 rounded-full'>
     <h1 className='text-3xl'>Cadastrar pedido</h1>
    </div>
  </div>
</div>
  );
}

export default App;
