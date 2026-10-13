import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ nome: '', email: '', telefone: '', mensagem: '' });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="container my-5">
      <p className="text-center text-muted mb-2">
        <Link to="/" className="text-muted">
          Início
        </Link>
        {' . '}
        <span>Contato</span>
      </p>

      <h2 className="text-center mb-4">Contato</h2>

  

      <form className="mx-auto" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome:
          </label>
          <input
            type="text"
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
          <label htmlFor="mensagem" className="form-label">
            Mensagem:
          </label>
          <textarea
            className="form-control"
            id="mensagem"
            name="mensagem"
            rows="4"
            placeholder="ex.: Sua mensagem"
            value={form.mensagem}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-buy w-100 mb-3" style={{ padding: '7px', fontSize: '1.1rem' }}>
          Enviar
        </button>

        {sent && (
          <p className="text-center text-success small">
            <i className="bi bi-check-circle me-1"></i>
            Mensagem enviada! Responderemos em breve.
          </p>
        )}
      </form>
    </div>
  );
}