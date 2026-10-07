import { Link } from 'react-router-dom';
import PainelPedidos from '../../components/PainelPedidos';

export default function GerenciarPedidos() {
  return (
    <div className="container my-5">
      <p className="text-center text-muted mb-2">
        <Link to="/" className="text-muted">
          Início
        </Link>
        {' . '}
        <Link to="/contaequipe" className="text-muted">
          Minha conta - Equipe
        </Link>
        {' . '}
        <span>Pedidos</span>
      </p>

      <h2 className="text-center mb-5">Gerenciar pedidos</h2>

      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <PainelPedidos/>
      </div>

      <div className="text-center mt-4">
        <Link to="/contaequipe" className="link-vinho fw-bold">
          ← Voltar para minha conta
        </Link>
      </div>
    </div>
  );
}