import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Sprint Marketing Agentur
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#pocetna">Početna</a>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                Usluge
              </a>
              <ul className="dropdown-menu">
                <li><Link href="/seo" className="dropdown-item">SEO Optimizacija</Link></li>
                <li><Link href="/ppc" className="dropdown-item">PPC Kampanje</Link></li>
                <li><Link href="/social" className="dropdown-item">Društvene Mreže</Link></li>
                <li><Link href="/webdev" className="dropdown-item">Web Development</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#o-nama">O nama</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#kontakt">Kontakt</a>
            </li>
            <li className="nav-item">
              <Link href="/de" className="nav-link">
                <Image 
                  src="https://flagcdn.com/20x15/de.png" 
                  alt="Deutsch" 
                  width={20} 
                  height={15} 
                  className="me-1" 
                />
                DE
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 