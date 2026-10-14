
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:8080/clientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        const mensagem = await resposta.text();
        setErro(mensagem || 'E-mail ou senha inválidos.');
        return;
      }

      const cliente = await resposta.json();

      sessionStorage.setItem('clienteLogado', JSON.stringify(cliente));
      window.dispatchEvent(new Event('clienteLogadoAtualizado'));

      navigate('/contausuario');
    } catch (erro) {
      console.error(erro);
      setErro('Não foi possível conectar ao servidor. Verifique se o back-end está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Iniciar sessão</h2>

      <form
        className="mx-auto"
        style={{ maxWidth: '400px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="ex.: seuemail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="senha" className="form-label">
            Senha:
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="senha"
              placeholder="ex.: suasenha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
            </button>
          </div>
        </div>

        {erro && (
          <div className="alert alert-danger py-2" role="alert">
            {erro}
          </div>
        )}

        <button
          type="submit"
          className="btn-buy w-100 mb-4"
          style={{ padding: '7px', fontSize: '1.1rem' }}
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Iniciar sessão'}
        </button>

        <div className="text-center small">
          <p className="mb-2">
            Não possui uma conta ainda?{' '}
            <Link to="/cadastro" className="fw-bold link-vinho">
              Criar uma conta
            </Link>
          </p>
          <p>
            Você faz parte da nossa equipe?{' '}
            <Link to="/loginequipe" className="fw-bold link-vinho">
              Entre aqui!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
