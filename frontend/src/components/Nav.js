"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [comprobando, setComprobando] = useState(true);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function revisarSesion() {
      setComprobando(true);
      try {
        const datos = await api("/auth/yo");
        if (activo) setUsuario(datos.usuario || null);
      } catch {
        if (activo) setUsuario(null);
      } finally {
        if (activo) setComprobando(false);
      }
    }

    revisarSesion();
    return () => { activo = false; };
  }, [pathname]);

  async function cerrarSesion() {
    setCerrando(true);
    try {
      await api("/auth/logout", { method: "POST", body: "{}" });
      setUsuario(null);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      alert(error.message || "No se pudo cerrar la sesión.");
    } finally {
      setCerrando(false);
    }
  }

  const activo = (ruta) => pathname === ruta;

  return (
    <nav aria-label="Navegación principal">
      <ul className="holder">
        <li><Link className={activo("/") ? "active" : ""} href="/">Home</Link></li>
        <li><Link className={activo("/servicios") ? "active" : ""} href="/servicios">Servicios</Link></li>
        <li><Link className={activo("/productos") ? "active" : ""} href="/productos">Productos</Link></li>
        <li><Link className={activo("/novedades") ? "active" : ""} href="/novedades">Novedades</Link></li>
        <li><Link className={activo("/contacto") ? "active" : ""} href="/contacto">Contacto</Link></li>

        {!comprobando && (
          usuario ? (
            <>
              <li><Link className={pathname.startsWith("/admin") ? "active" : ""} href="/admin">Panel de administración</Link></li>
              <li>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  disabled={cerrando}
                  style={{ cursor: "pointer", font: "inherit", padding: "0.4rem 0.65rem" }}
                >
                  {cerrando ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link className={activo("/login") ? "active" : ""} href="/login">
                Iniciar sesión
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
