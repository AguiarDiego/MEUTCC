import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/HomeCliente/Home';
import Cart from './pages/Carrinho/Cart';
import Contact from './pages/HomeCliente/Contato';
import Login from './pages/Login/Login';
import LoginEquipe from './pages/Login/LoginEquipe';
import ContaEquipe from './pages/Conta/ContaEquipe';
import GerenciarPedidos from './pages/Conta/GerenciarPedidos';
import SobreNos from './pages/HomeCliente/SobreNos';

export default function App() {
  return (
    <CartProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginequipe" element={<LoginEquipe />} />
        <Route path="/contaequipe" element={<ContaEquipe />} />
        <Route path="/gerenciarpedidos" element={<GerenciarPedidos />} />
        <Route path="/sobrenos" element={<SobreNos />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}