import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container my-5">

      <h2 className="text-center mb-4">Iniciar sessão</h2>

      <form className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="ex.: filipedepaula@gmail.com"
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

        <button type="submit" className="btn-buy w-100 mb-4" style={{ padding: '7px', fontSize: '1.1rem' }}>
          Iniciar sessão
        </button>

        <div className="text-center small">
          <p className="mb-2">
            Não possui uma conta ainda?{' '}
            <Link to="/criar-conta" className="fw-bold link-vinho">
              Criar uma conta
            </Link>
          </p>
          <p>
            Você faz parte da nossa equipe?{' '}
            <Link to="/login-equipe" className="fw-bold link-vinho">
              Entre aqui!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}