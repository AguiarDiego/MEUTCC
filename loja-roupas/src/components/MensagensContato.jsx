
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MensagensContato() {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarMensagens() {
      try {
        const resposta = await fetch(
          'http://localhost:8080/contato/mensagens'
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as mensagens.');
        }

        const dados = await resposta.json();
        setMensagens(dados);
      } catch (erro) {
        console.error('Erro ao carregar mensagens:', erro);
        setErro('Não foi possível carregar as mensagens.');
      } finally {
        setCarregando(false);
      }
    }

    carregarMensagens();
  }, []);

  return (
    <div className="container my-5">
      <p className="text-muted mb-2">
        <Link to="/" className="text-muted">
          Início
        </Link>
        {' . '}
        <Link to="/contaequipe" className="text-muted">
          Minha conta - Equipe
        </Link>
        {' . '}
        <span>Mensagens de contato</span>
      </p>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h2 className="mb-0">Mensagens de contato</h2>

        <Link
          to="/contaequipe"
          className="btn btn-dark text-decoration-none"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Voltar à conta
        </Link>
      </div>

      {carregando && (
        <p className="text-muted">Carregando mensagens...</p>
      )}

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {!carregando && !erro && mensagens.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-envelope-open display-4 text-muted"></i>
          <p className="text-muted mt-3">
            Nenhuma mensagem recebida até o momento.
          </p>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {mensagens.map((mensagem) => (
          <article className="card p-4" key={mensagem.id}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <h5 className="mb-0">{mensagem.nome}</h5>

              <small className="text-muted">
                {mensagem.dataEnvio
                  ? new Date(mensagem.dataEnvio).toLocaleString('pt-BR')
                  : ''}
              </small>
            </div>

            <p className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              <strong>E-mail:</strong> {mensagem.email}
            </p>

            <p className="mb-3">
              <i className="bi bi-telephone me-2"></i>
              <strong>Telefone:</strong> {mensagem.telefone}
            </p>

            <div className="border-top pt-3">
              <strong className="d-block mb-2">Mensagem</strong>

              <p
                className="mb-0"
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {mensagem.mensagem}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}