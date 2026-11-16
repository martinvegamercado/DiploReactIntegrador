
import Link from "next/link";

export default function Home() {
  return (
   <section className="hero">
      <div className="hero-text">
        <h1>Potenciamos el futuro con código</h1>
        <p>Somos Bytes. Especialistas en desarrollo de software moderno, creando soluciones Front-end y Back-end a la medida de tu negocio.</p>
        
        {/* Usamos Link en lugar de <a> */}
        <Link href="/servicios" className="btn">Explorar Servicios</Link>
      </div>
      <div className="hero-image">
        {/* Asegúrate de tener la imagen guardada en la carpeta public/img/ */}
        <img src="/img/hero-dev.png" alt="Desarrollador trabajando en sistema" />
      </div>
    </section>
  );
}
