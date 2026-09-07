// Configuramos el título y descripción de la pestaña
export const metadata = {
  title: "Servicios | Bytes",
  description: "Soluciones integrales de software para llevar tu empresa al siguiente nivel.",
};

export default function Page() {
  return (
    <div className="page-content">
      <section className="services">
        <h1>Nuestros Servicios</h1>
        <p className="subtitle">Soluciones integrales de software para llevar tu empresa al siguiente nivel.</p>
        
        <div className="service-cards">
          <div className="card">
            {/* Asegúrate de cerrar la etiqueta img con /> y ajustar la ruta */}
            <img src="/img/icon-frontend.png" alt="Desarrollo Front-end" />
            <h2>Desarrollo Front-end</h2>
            <p>Diseñamos y programamos interfaces de usuario interactivas, atractivas y optimizadas. Utilizamos las últimas tecnologías para asegurar que la experiencia de tus usuarios sea fluida y responsiva en cualquier dispositivo.</p>
          </div>
          
          <div className="card">
            <img src="/img/icon-backend.png" alt="Desarrollo Back-end" />
            <h2>Desarrollo Back-end</h2>
            <p>Construimos la lógica y arquitectura detrás de escena. Sistemas robustos, seguros y altamente escalables que garantizan el correcto funcionamiento y procesamiento de datos de tu aplicación.</p>
          </div>
        </div>
      </section>
    </div>
  );
}