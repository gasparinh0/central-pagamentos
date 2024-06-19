//Import do CSS
import './App.css';

//Import do react-icons
import { TbPigMoney } from "react-icons/tb";

//Imports de componentes
import Tabs from './components/Tabs';
import Navbar from './components/Navbar';



function App() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Tabs */}
      <Tabs />
    </div>


  );
}

export default App;
