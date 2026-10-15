import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginEquipe() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Credenciais da equipe
  const ADMIN_EMAILS = [
  'arthuraugusto2@guetosl.com',
  'bryanaraujo5@guetosl.com',
  'danielbrito6@guetosl.com',
  'diegoaguiar9@guetosl.com',
  'enzogabriel13@guetosl.com',
  'gabrielfernandes19@guetosl.com',
  'igorbrasil31@guetosl.com',
  ];

  const ADMIN_SENHA = 'souguetosl';

  function handleSubmit(e) {
  e.preventDefault();

  if (
    ADMIN_EMAILS.includes(email.trim().toLowerCase()) &&
    senha === ADMIN_SENHA
  ) {
    localStorage.setItem('equipeLogada', 'true');
    localStorage.setItem(
    'emailEquipe',
    email.trim().toLowerCase()
  );

    setErro('');
    navigate('/contaequipe');
  } else {
    setErro('E-mail ou senha incorretos.');
  }
}

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Login - Equipe</h2>

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
            placeholder="Digite o e-mail da equipe"
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
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
              aria-label={
                showPassword ? 'Ocultar senha' : 'Mostrar senha'
              }
            >
              <i
                className={`bi ${
                  showPassword ? 'bi-eye' : 'bi-eye-slash'
                }`}
              ></i>
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
        >
          Iniciar sessão
        </button>
      </form>
    </div>
  );
}