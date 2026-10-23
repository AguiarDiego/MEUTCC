
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function obterClienteLogado() {
  try {
    const clienteSalvo = sessionStorage.getItem('clienteLogado');
    return clienteSalvo ? JSON.parse(clienteSalvo) : null;
  } catch {
    return null;
  }
}

const FRETE_GRATIS_A_PARTIR_DE = 238.9;

const FORMAS_PAGAMENTO = [
  { id: 'cartao', nome: 'Cartão de crédito', icone: 'bi-credit-card', selo: 'ATÉ 4 PARCELAS SEM JUROS' },
  { id: 'pix', nome: 'Pix', icone: 'bi-qr-code', selo: '5% DE DESCONTO' },
];

function paraNumero(valor) {
  return Number(String(valor).replace(',', '.'));
}

function formatar(valor) {
  return valor.toFixed(2).replace('.', ',');
}

export default function TelaCompra() {
  const { items: itensCarrinho = [] } = useCart();
  const [cliente] = useState(obterClienteLogado);
  const [verificandoCupom, setVerificandoCupom] = useState(false);
  const [cep, setCep] = useState('');
  const [freteCalculado, setFreteCalculado] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);

  const items = itensCarrinho
    .filter((item) => item.product)
    .map((item) => ({
      id: item.cartKey ?? item.product.id,
      produtoId: item.product.id,
      image: item.product.image,
      name: item.product.name,
      price: item.product.price,
      quantity: item.qty ?? 1,
      tamanho: item.product.tamanho,
    }));

  const [pagamento, setPagamento] = useState('cartao');
  const [mostrarCupom, setMostrarCupom] = useState(false);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [cupomMsg, setCupomMsg] = useState('');
  const [pedidoFeito, setPedidoFeito] = useState(false);

  const subtotal = items.reduce(
    (soma, item) => soma + paraNumero(item.price) * (item.quantity ?? 1),
    0
  );

  const frete =
    subtotal === 0 || subtotal >= FRETE_GRATIS_A_PARTIR_DE
      ? 0
      : freteCalculado ?? 0;

  const descontoCupom = cupomAplicado ? subtotal * 0.1 : 0;
  const descontoPix =
    pagamento === 'pix' ? (subtotal - descontoCupom) * 0.05 : 0;
  const total = subtotal - descontoCupom - descontoPix + frete;

  async function calcularFrete() {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      alert('Digite um CEP válido com 8 números.');
      return;
    }

    setCalculandoFrete(true);

    try {
      const resposta = await fetch(
        `http://localhost:8080/frete/cotacao?cep=${cepLimpo}`
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar o frete.');
      }

      const dados = await resposta.json();
      const opcao = dados.find(
        (servico) => !servico.error && servico.price != null
      );

      if (!opcao) {
        throw new Error('Nenhuma opção de frete foi encontrada para esse CEP.');
      }

      setFreteCalculado(Number(opcao.price));
    } catch (erro) {
      setFreteCalculado(null);
      alert(erro.message || 'Erro ao calcular o frete.');
    } finally {
      setCalculandoFrete(false);
    }
  }

  async function aplicarCupom() {
    if (cupom.trim().toUpperCase() !== 'GUETOSL10') {
      setCupomAplicado(false);
      setCupomMsg('Cupom inválido.');
      return;
    }

    if (!cliente?.id) {
      setCupomAplicado(false);
      setCupomMsg('Faça login para verificar se você pode usar este cupom.');
      return;
    }

    setVerificandoCupom(true);
    setCupomAplicado(false);
    setCupomMsg('');

    try {
      const resposta = await fetch(
        `http://localhost:8080/pedidos/cupom-primeira-compra/${cliente.id}`
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível verificar o cupom.');
      }

      const podeUsarCupom = await resposta.json();

      if (podeUsarCupom === true) {
        setCupomAplicado(true);
        setCupomMsg('Cupom aplicado: 10% de desconto.');
      } else {
        setCupomAplicado(false);
        setCupomMsg('Este cupom é válido apenas na primeira compra.');
      }
    } catch (erro) {
      console.error(erro);
      setCupomAplicado(false);
      setCupomMsg('Não foi possível verificar o cupom. Tente novamente.');
    } finally {
      setVerificandoCupom(false);
    }
  }

  async function fazerPedido() {
    const clienteSalvo = sessionStorage.getItem('clienteLogado');

    if (!clienteSalvo) {
      alert('Faça login para finalizar seu pedido.');
      return;
    }

    let clienteAtual;

    try {
      clienteAtual = JSON.parse(clienteSalvo);
    } catch {
      alert('Não foi possível identificar sua conta. Entre novamente.');
      return;
    }

    if (!clienteAtual?.id) {
      alert('Não foi possível identificar sua conta. Entre novamente.');
      return;
    }

    if (items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const itensPedido = items.map((item) => ({
      produtoId: Number(item.produtoId),
      quantidade: Number(item.quantity ?? 1),
    }));

    if (
      itensPedido.some(
        (item) =>
          !Number.isInteger(item.produtoId) ||
          item.produtoId <= 0 ||
          !Number.isInteger(item.quantidade) ||
          item.quantidade <= 0
      )
    ) {
      alert('Não foi possível identificar os produtos do carrinho.');
      return;
    }

    const pedidoRequest = {
      itens: itensPedido,
      formaPagamento: pagamento,
      cupomAplicado,
      cep: cep.replace(/\D/g, ''),
    };

    try {
      const resposta = await fetch(
        `http://localhost:8080/pedidos/${clienteAtual.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pedidoRequest),
        }
      );

      if (!resposta.ok) {
        const mensagem = await resposta.text();
        throw new Error(mensagem || 'Falha ao registrar o pedido.');
      }

      setPedidoFeito(true);
    } catch (erro) {
      console.error(erro);
      alert(
        erro.message ||
          'Não foi possível registrar o pedido. Tente novamente.'
      );
    }
  }

  if (pedidoFeito) {
    return (
      <div className="container my-5 text-center">
        <i className="bi bi-check-circle fs-1 text-success d-block mb-3"></i>
        <h2 className="mb-3">Pedido realizado!</h2>
        <p className="text-muted">Você receberá as atualizações por e-mail.</p>
        <Link to="/" className="link-vinho fw-bold">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2 className="mb-3">Seu carrinho está vazio</h2>
        <Link to="/" className="link-vinho fw-bold">
          Ir para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0"></p>
        <span className="small fw-medium">
          <i className="bi bi-shield-check text-success me-1"></i>
          COMPRA SEGURA <br className="d-md-none" />
          100% PROTEGIDO
        </span>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div
            className="p-3 mb-4 small text-muted"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            <i className="bi bi-info-circle me-2"></i>
            Confira com atenção os dados de entrega e pagamento!
          </div>

          <div className="small mb-4">
            <p className="mb-3">
              <i className="bi bi-person-fill me-2"></i>
              {cliente?.nome || 'Cliente não identificado'}
              <br />
              <span className="ms-4 text-muted">
                {cliente?.email || 'E-mail não disponível'}
              </span>
            </p>

            <div className="mb-3">
              <label htmlFor="cepEntrega" className="form-label">
                <i className="bi bi-geo-alt-fill me-2"></i>
                CEP de entrega
              </label>

              <div className="d-flex gap-2">
                <input
                  id="cepEntrega"
                  type="text"
                  className="form-control"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    setFreteCalculado(null);
                  }}
                  maxLength={9}
                  inputMode="numeric"
                />

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={calcularFrete}
                  disabled={calculandoFrete}
                >
                  {calculandoFrete ? 'Calculando...' : 'Calcular'}
                </button>
              </div>

              {freteCalculado !== null && (
                <p className="small text-success mt-2 mb-0">
                  Frete consultado: R$ {formatar(freteCalculado)}
                </p>
              )}
            </div>

            <p className="mb-0">
              <i className="bi bi-truck me-2"></i>
              Envio padrão •{' '}
              {subtotal >= FRETE_GRATIS_A_PARTIR_DE
                ? 'Frete grátis'
                : freteCalculado !== null
                  ? `R$ ${formatar(freteCalculado)}`
                  : 'Informe o CEP para calcular'}
              <br />
              <span className="text-muted ms-4">Chega em até 4 dias úteis</span>
            </p>
          </div>

          {/* Forma de pagamento */}
          <h6 className="mb-3">FORMA DE PAGAMENTO</h6>
          <div className="d-flex flex-column gap-2">
            {FORMAS_PAGAMENTO.map((forma) => (
              <button
                key={forma.id}
                type="button"
                onClick={() => setPagamento(forma.id)}
                className="btn d-flex align-items-center text-start py-3"
                style={{
                  border:
                    pagamento === forma.id
                      ? '2px solid var(--badge-color)'
                      : '1px solid #ccc',
                  borderRadius: 0,
                }}
              >
                <i className={`bi ${forma.icone} fs-5 me-3`}></i>
                <span className="fw-medium flex-grow-1">{forma.nome}</span>
                {forma.selo && (
                  <span
                    className="badge rounded-0 me-3"
                    style={{
                      backgroundColor: 'var(--badge-color)',
                      fontSize: '0.65rem',
                    }}
                  >
                    {forma.selo}
                  </span>
                )}
                <i
                  className={`bi ${
                    pagamento === forma.id
                      ? 'bi-check-circle-fill'
                      : 'bi-chevron-right'
                  }`}
                ></i>
              </button>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div
            className="p-3"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            {items.map((item) => (
              <div key={item.id} className="d-flex align-items-center mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    objectFit: 'cover',
                  }}
                  className="me-3"
                  onError={(e) => {
                    e.currentTarget.src = '/Imagem/placeholder.svg';
                  }}
                />
                <div className="flex-grow-1">
                  <p className="mb-0 fw-medium">{item.name}</p>
                  <p className="mb-0 small text-muted">
                    Qtd: {item.quantity ?? 1}
                  </p>
                </div>
                <span className="fw-bold">
                  R$
                  {formatar(
                    paraNumero(item.price) * (item.quantity ?? 1)
                  )}
                </span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between mb-1">
              <span>Subtotal:</span>
              <span>R${formatar(subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between mb-1">
              <span>Custo de frete:</span>
              <span>
                {subtotal >= FRETE_GRATIS_A_PARTIR_DE
                  ? 'Grátis'
                  : freteCalculado !== null
                    ? `R$ ${formatar(freteCalculado)}`
                    : 'Calcule pelo CEP'}
              </span>
            </div>

            {descontoCupom > 0 && (
              <div className="d-flex justify-content-between mb-1 text-success">
                <span>Cupom:</span>
                <span>-R${formatar(descontoCupom)}</span>
              </div>
            )}

            {descontoPix > 0 && (
              <div className="d-flex justify-content-between mb-1 text-success">
                <span>Desconto Pix:</span>
                <span>-R${formatar(descontoPix)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
              <span>Total:</span>
              <span>R${formatar(total)}</span>
            </div>

            <div className="text-center mt-4">
              {!mostrarCupom ? (
                <button
                  type="button"
                  className="btn btn-link small fw-bold text-dark"
                  onClick={() => setMostrarCupom(true)}
                >
                  Adicionar cupom de desconto
                </button>
              ) : (
                <>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o cupom"
                      value={cupom}
                      onChange={(e) => {
                        setCupom(e.target.value);
                        setCupomAplicado(false);
                        setCupomMsg('');
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={aplicarCupom}
                      disabled={verificandoCupom}
                    >
                      {verificandoCupom ? 'Verificando...' : 'Aplicar'}
                    </button>
                  </div>
                  {cupomMsg && (
                    <p className="small mt-2 mb-0">{cupomMsg}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          className="btn-buy"
          style={{ padding: '10px 80px', fontSize: '1.1rem' }}
          onClick={fazerPedido}
        >
          Fazer pedido
        </button>
      </div>
    </div>
  );
}
