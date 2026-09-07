
import Link from 'next/link';
export default function Page() {
  return (
    <section className="products">
            <h1>Nuestros Productos</h1>
            <p className="subtitle">Soluciones tecnológicas empaquetadas y listas para escalar tu negocio.</p>
            
            <div className="service-cards">
                
                <div className="card" style={{ maxWidth: '900px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--accent-blue)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Bytes Insight Engine</h2>
                        <p style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '1.1rem', opacity: 0.8 }}>Modelo de Ciencia de Datos para Negocios</p>
                    </div>
                    
                    <p>Transforma los datos crudos de tu empresa en decisiones estratégicas. Bytes Insight Engine es un modelo predictivo avanzado diseñado para integrarse directamente en la infraestructura de tu negocio, permitiendo descubrir patrones ocultos, proyectar demanda y optimizar recursos operativos sin necesidad de un equipo interno de científicos de datos.</p>
                    
                    <div>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '1.3rem' }}>Características Técnicas:</h3>
                        <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                            <li><strong>Análisis Predictivo Avanzado:</strong> Algoritmos entrenados en <strong>Python</strong> para proyecciones de ventas y clasificación automática de clientes según su comportamiento.</li>
                            <li><strong>Integración Fluida:</strong> Despliegue compatible de forma nativa con bases de datos relacionales como <strong>SQL Server</strong> para asegurar que tus datos históricos se sincronicen sin fricción.</li>
                            <li><strong>Escalabilidad en la Nube:</strong> Preparado para integrarse con arquitecturas de datos modernas y plataformas de monitoreo de capacidad como <strong>Microsoft Fabric</strong>.</li>
                            <li><strong>Dashboards en Tiempo Real:</strong> Exportación de métricas a endpoints listos para ser consumidos por cualquier Front-end.</li>
                        </ul>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                       <Link href="/contacto" className="btn btn-full" style={{ display: 'inline-block', maxWidth: '300px' }}>
                Solicitar una Demo
              </Link>
                    </div>
                </div>
            </div>
        </section>
  )
}
