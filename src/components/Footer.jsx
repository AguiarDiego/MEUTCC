export default function Footer() {
  return (
    <footer
      id="contato"
      className="text-white text-center py-4 mt-auto"
      style={{ backgroundColor: 'var(--primary-color)' }}
    >
      <div className="container">
        <p className="fw-bold mb-1" style={{ letterSpacing: '0.08em' }}>
          GUETOSL
        </p>
        <p className="mb-0 small">
          &copy; {new Date().getFullYear()} GuetoSL <br />
          contato@guetosl.com.br
        </p>
      </div>
    </footer>
  );
}
