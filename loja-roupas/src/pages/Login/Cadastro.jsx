import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  const [form, setForm] = useState({
  nome: '',
  email: '',
  telefone: '',
  senha: '',
  confirmarSenha: ''
});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  
async function handleSubmit(e) {
  e.preventDefault();

  if (form.senha !== form.confirmarSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    const resposta = await fetch('http://localhost:8080/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        senha: form.senha
      })
    });

    if (resposta.ok) {
      alert('Conta criada com sucesso!');

      setForm({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      });
    } else {
      const mensagem = await resposta.text();
      alert(mensagem || 'Não foi possível criar a conta.');
    }
  } catch (erro) {
    alert('Não foi possível conectar ao servidor. Verifique se o back-end está rodando.');
    console.error(erro);
  }
}

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container my-5">

      <h2 className="text-center mb-4">Cadastro</h2>

  

      <form className="mx-auto" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome:
          </label>
          <input
            type="text"
            autoComplete="name"
            className="form-control"
            id="nome"
            name="nome"
            placeholder="ex.: Filipe Silva de Paula"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail:
          </label>
          <input
            type="email"
            autoComplete="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="ex.: seuemail@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="telefone" className="form-label">
            Telefone:
          </label>
          <input
            type="tel"
            autoComplete="tel"
            className="form-control"
            id="telefone"
            name="telefone"
            placeholder="ex.: 11989434777"
            value={form.telefone}
            onChange={handleChange}
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
          name="senha"
          placeholder="Digite sua senha"
          value={form.senha}
          onChange={handleChange}
          required
          minLength={8}
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

      
        <div className="mb-4">
        <label htmlFor="confirmarSenha" className="form-label">
            Confirmar senha:
        </label>

        <div className="position-relative">
        <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            id="confirmarSenha"
            name="confirmarSenha"
            placeholder="Digite sua senha novamente"
            value={form.confirmarSenha}
            onChange={handleChange}
            required
            minLength={8}
        />
        </div>
        </div>
        


        <button type="submit" className="btn-buy w-100 mb-3" style={{ padding: '7px', fontSize: '1.1rem' }}>
          Criar conta
        </button>

      </form>
    </div>
  );
}