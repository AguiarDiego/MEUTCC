import { useState } from 'react';
import { orders as initialOrders } from '../data/orders.js';

const STATUS_LABELS = {
  pagamento: { texto: 'Aguardando pagamento', cor: '#856404', fundo: '#fff3cd' },
  preparo: { texto: 'Pagamento confirmado - Preparar pedido', cor: '#0c5460', fundo: '#d1ecf1' },
  enviado: { texto: 'Enviado', cor: '#155724', fundo: '#d4edda' },
};

export default function PainelPedidos() {
  const [orders, setOrders] = useState(initialOrders);

  function avancarStatus(orderId) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        if (order.status === 'pagamento') {
          return { ...order, status: 'preparo' };
        }
        if (order.status === 'preparo') {
          // Aqui, quando a API estiver pronta, entra a chamada real
          // avisando o cliente que o pedido foi enviado (e-mail, notificação, etc.)
          return { ...order, status: 'enviado' };
        }
        return order;
      })
    );
  }

  return (
    <div>
      <h4 className="mb-4">Pedidos</h4>

      {orders.map((order) => {
        const statusInfo = STATUS_LABELS[order.status];

        return (
          <div key={order.id} className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0">Pedido #{order.id}</h6>
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{ backgroundColor: statusInfo.fundo, color: statusInfo.cor }}
                >
                  {statusInfo.texto}
                </span>
              </div>

              <p className="mb-1">
                <strong>Cliente:</strong> {order.cliente.nome} ({order.cliente.contato})
              </p>

              <p className="mb-1">
                <strong>Itens:</strong>{' '}
                {order.itens.map((item) => `${item.quantidade}x ${item.nome}`).join(', ')}
              </p>

              <p className="mb-1">
                <strong>Valor total:</strong> R${order.valorTotal.toFixed(2).replace('.', ',')}
              </p>

              <p className="mb-3">
                <strong>Endereço:</strong> {order.endereco}
              </p>

              {order.status !== 'enviado' && (
                <button
                  type="button"
                  className="btn-buy"
                  style={{ padding: '6px 16px', fontSize: '0.9rem', width: 'auto' }}
                  onClick={() => avancarStatus(order.id)}
                >
                  {order.status === 'pagamento'
                    ? 'Confirmar que pagamento foi verificado'
                    : 'Marcar como enviado'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}