import { useState } from 'react';

const faqs = [
  {
    question: 'Quanto tempo leva para minha compra chegar?',
    answer:
      'Enviamos para todo o Brasil. Pedidos processados em até 2 dias úteis, com entrega estimada entre 5 e 12 dias úteis dependendo da região.',
  },
  {
    question: 'Como funciona a troca ou devolução?',
    answer:
      'Você tem até 30 dias corridos após o recebimento para solicitar troca ou devolução, desde que o produto esteja sem uso e com etiqueta.',
  },
  {
    question: 'Vocês têm loja física?',
    answer:
      'Por enquanto somos 100% online, mas atendemos por WhatsApp para tirar dúvidas antes da compra.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
    window.clearTimeout(handleSubmit._t);
    handleSubmit._t = window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <main>
      <section className="py-5" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="container text-center py-4">
          <h1 className="fw-bold mb-3">Fale com a GuetoSL</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '560px' }}>
            Dúvidas sobre um pedido, troca, tamanho ou parceria? Nosso time
            responde em até 1 dia útil. É só escolher o canal que preferir
            ou preencher o formulário abaixo.
          </p>
        </div>
      </section>

      <section className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-whatsapp fs-2 mb-3 d-block" style={{ color: 'var(--primary-color)' }}></i>
              <h5>WhatsApp</h5>
              <p className="text-muted mb-1">Resposta mais rápida</p>
              <a href="https://wa.me/5511999999999" className="fw-medium" style={{ color: 'var(--accent-color)' }}>
                (11) 99999-9999
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-envelope fs-2 mb-3 d-block" style={{ color: 'var(--primary-color)' }}></i>
              <h5>E-mail</h5>
              <p className="text-muted mb-1">Para dúvidas e parcerias</p>
              <a href="mailto:contato@guetosl.com.br" className="fw-medium" style={{ color: 'var(--accent-color)' }}>
                contato@guetosl.com.br
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-instagram fs-2 mb-3 d-block" style={{ color: 'var(--primary-color)' }}></i>
              <h5>Instagram</h5>
              <p className="text-muted mb-1">Lançamentos e bastidores</p>
              <a href="https://instagram.com/guetosl" className="fw-medium" style={{ color: 'var(--accent-color)' }}>
                @guetosl
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="row g-5">
          <div className="col-lg-7">
            <h2 className="section-title text-lg-start">Envie uma mensagem</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="assunto" className="form-label">
                    Assunto
                  </label>
                  <select
                    className="form-select"
                    id="assunto"
                    name="assunto"
                    value={form.assunto}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="pedido">Dúvida sobre um pedido</option>
                    <option value="troca">Troca ou devolução</option>
                    <option value="produto">Dúvida sobre um produto</option>
                    <option value="parceria">Parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="mensagem" className="form-label">
                    Mensagem
                  </label>
                  <textarea
                    className="form-control"
                    id="mensagem"
                    name="mensagem"
                    rows="5"
                    value={form.mensagem}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-dark px-4">
                    Enviar mensagem
                  </button>
                  {sent && (
                    <span className="ms-3 text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Mensagem enviada! Responderemos em breve.
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-5">
            <h2 className="section-title text-lg-start">Perguntas frequentes</h2>
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div className="accordion-item" key={faq.question}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq-${index}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`faq-${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-muted">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h6 className="fw-bold mb-2">
                <i className="bi bi-clock me-2"></i>
                Horário de atendimento
              </h6>
              <p className="text-muted mb-0 small">
                Segunda a sexta, das 9h às 18h. <br />
                Sábados, das 9h às 13h.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
