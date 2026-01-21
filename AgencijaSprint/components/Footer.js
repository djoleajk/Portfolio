import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="mb-4">
              Sprint Marketing Agentur
            </h5>
            <p className="mb-3">Vaš partner za digitalni rast i razvoj. Pretvaramo ideje u digitalni uspeh.</p>
            <div className="social-links">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          <div className="col-lg-2">
            <h5 className="mb-4">Brzi Linkovi</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/" className="text-white text-decoration-none">Početna</Link></li>
              <li className="mb-2"><a href="#o-nama" className="text-white text-decoration-none">O nama</a></li>
              <li className="mb-2"><a href="#usluge" className="text-white text-decoration-none">Usluge</a></li>
              <li className="mb-2"><a href="#kontakt" className="text-white text-decoration-none">Kontakt</a></li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h5 className="mb-4">Naše Usluge</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/seo" className="text-white text-decoration-none">SEO Optimizacija</Link></li>
              <li className="mb-2"><Link href="/ppc" className="text-white text-decoration-none">PPC Kampanje</Link></li>
              <li className="mb-2"><Link href="/social" className="text-white text-decoration-none">Društvene Mreže</Link></li>
              <li className="mb-2"><Link href="/webdev" className="text-white text-decoration-none">Web Development</Link></li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h5 className="mb-4">Kontaktirajte Nas</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i> 
                Karadjordjeva 127
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i> 
                065 856 0207
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                agencijasprint@gmail.com
              </li>
              <li className="mb-2">
                <i className="fas fa-clock me-2"></i>
                Pon - Pet: 09:00 - 17:00
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <hr className="bg-light" />
            <div className="text-center mt-4">
              <p className="mb-0">&copy; 2025 Sprint Marketing Agency. Sva prava zadržana.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 