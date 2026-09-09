'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isActive = (path) => path === pathname;

  return (
    <nav>
      <ul className='holder'>
        <li><Link className={isActive("/") ? 'active' : ''} href="/">Home</Link></li>
        <li><Link className={isActive("/servicios") ? 'active' : ''} href="/servicios">Sevicios</Link></li>
        <li><Link className={isActive("/productos") ? 'active' : ''} href="/productos">Productos</Link></li>
        <li><Link className={isActive("/novedades") ? 'active' : ''} href="/novedades">Novedades</Link></li>
        <li><Link className={isActive("/contacto") ? 'active' : ''} href="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  )
}