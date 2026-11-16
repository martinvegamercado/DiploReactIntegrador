import React from 'react'

function Contacto() {
  return (
    <section className="contact">
            <h1>Contáctanos</h1>
            <p className="subtitle">¿Tienes un proyecto en mente? Hablemos.</p>
            
            <div className="contact-container">
                <form action="#" method="POST" className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <input type="text" id="name" name="name" required placeholder="Tu nombre"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" required placeholder="tu@email.com"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Mensaje</label>
                        <textarea id="message" name="message" rows="6" required placeholder="Cuéntanos sobre tu proyecto..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-full">Enviar Mensaje</button>
                </form>
            </div>
        </section>
  )
}

export default Contacto