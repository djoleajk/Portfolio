import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import ContactForm from '../components/ContactForm';

export default function Home() {
  useEffect(() => {
    // Učitavanje Bootstrap JS-a
    const loadBootstrap = async () => {
      const bootstrap = await import('bootstrap');
    };
    loadBootstrap();

    // jQuery funkcionalnost
    if (typeof window !== 'undefined') {
      const $ = window.jQuery;
      if ($) {
        // Animacija brojača za statistiku
        function animateBrojac() {
          $('.stat-number').each(function() {
            const $this = $(this);
            const broj = parseInt($this.text());
            $({ Counter: 0 }).animate({
              Counter: broj
            }, {
              duration: 2000,
              easing: 'swing',
              step: function() {
                $this.text(Math.ceil(this.Counter));
              }
            });
          });
        }

        // Parallax efekat za hero sekciju
        $(window).scroll(function() {
          const scroll = $(window).scrollTop();
          $('.hero-section').css({
            'background-position': 'center ' + (scroll * 0.5) + 'px'
          });
        });

        // Animirani loading za kartice usluga
        $('.service-card').each(function(index) {
          $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
          }).delay(index * 200).animate({
            'opacity': '1',
            'transform': 'translateY(0)'
          }, 1000);
        });

        // Interaktivni hover efekti
        $('.service-card').hover(
          function() {
            $(this).find('i').addClass('fa-spin');
            $(this).find('h4').css('color', '#0d6efd');
          },
          function() {
            $(this).find('i').removeClass('fa-spin');
            $(this).find('h4').css('color', '');
          }
        );
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sprint Marketing Agency - Digitalna Marketing Agencija</title>
        <meta name="description" content="Profesionalna digitalna marketing agencija u Hamburgu. SEO optimizacija, Google Ads, društvene mreže i izrada web sajtova. Povećajte online vidljivost vašeg biznisa." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sprintmarketing.de/sr/" />
        <meta property="og:title" content="Sprint Marketing Agency - Vaša Digitalna Marketing Agencija" />
        <meta property="og:description" content="Specijalizovani za SEO, Google Ads, društvene mreže i web development. Pomažemo vam da dostignete vašu ciljnu grupu i povećate prodaju." />
        <meta property="og:image" content="https://sprintmarketing.de/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sprintmarketing.de/sr/" />
        <meta property="twitter:title" content="Sprint Marketing Agency - Digitalni Marketing Eksperti" />
        <meta property="twitter:description" content="Vaša full-service digitalna marketing agencija u Hamburgu. SEO, PPC, društvene mreže i više." />
        <meta property="twitter:image" content="https://sprintmarketing.de/images/twitter-image.jpg" />

        {/* Dodatni meta tagovi */}
        <meta name="keywords" content="digitalni marketing Hamburg, SEO optimizacija, Google Ads, društvene mreže, izrada sajtova, online marketing, PPC oglašavanje" />
        <meta name="geo.region" content="DE-HH" />
        <meta name="geo.placename" content="Hamburg" />
        <link rel="alternate" hreflang="sr" href="https://sprintmarketing.de/sr/" />
        <link rel="alternate" hreflang="de" href="https://sprintmarketing.de/" />
        <link rel="canonical" href="https://sprintmarketing.de/sr/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      </Head>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Sprint Marketing Agentur
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#pocetna">Početna</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
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
                  <img src="https://flagcdn.com/20x15/de.png" alt="Deutsch" className="me-1" />
                  DE
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero-section" id="pocetna">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-4">Digitalni Marketing za Vaš Uspeh</h1>
              <p className="lead">Povećajte vidljivost vašeg brenda i dostignite nove klijente kroz digitalne kanale</p>
              <a href="#kontakt" className="btn btn-primary btn-lg">Kontaktirajte nas</a>
            </div>
          </div>
        </div>
      </section>

      {/* Usluge sekcija */}
      <section id="usluge" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-5">Naše Usluge</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card service-card">
                <div className="card-body text-center">
                  <i className="fas fa-code fa-3x mb-3 text-primary"></i>
                  <h4>Web Development</h4>
                  <p>Izrada modernih i responzivnih web sajtova po vašoj meri</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check text-success me-2"></i>Landing stranice</li>
                    <li><i className="fas fa-check text-success me-2"></i>Poslovni sajtovi</li>
                    <li><i className="fas fa-check text-success me-2"></i>E-commerce rešenja</li>
                  </ul>
                  <Link href="/webdev" className="btn btn-outline-primary mt-3">Saznaj više</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card service-card">
                <div className="card-body text-center">
                  <i className="fas fa-ad fa-3x mb-3 text-primary"></i>
                  <h4>Google Ads</h4>
                  <p>Profesionalno vođenje Google Ads kampanja</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check text-success me-2"></i>Search kampanje</li>
                    <li><i className="fas fa-check text-success me-2"></i>Display oglašavanje</li>
                    <li><i className="fas fa-check text-success me-2"></i>Shopping kampanje</li>
                  </ul>
                  <Link href="/ppc" className="btn btn-outline-primary mt-3">Saznaj više</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card service-card">
                <div className="card-body text-center">
                  <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
                  <h4>SEO Optimizacija</h4>
                  <p>Unapredite vašu vidljivost na pretraživačima</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check text-success me-2"></i>Tehnička optimizacija</li>
                    <li><i className="fas fa-check text-success me-2"></i>Content strategija</li>
                    <li><i className="fas fa-check text-success me-2"></i>Link building</li>
                  </ul>
                  <Link href="/seo" className="btn btn-outline-primary mt-3">Saznaj više</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistika sekcija */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="stat-card text-center">
                <div className="stat-circle mx-auto">
                  <div className="stat-circle-inner">
                    <i className="fas fa-users fa-2x"></i>
                    <div className="stat-number">500+</div>
                    <p className="stat-label">Zadovoljnih klijenata</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card text-center">
                <div className="stat-circle mx-auto">
                  <div className="stat-circle-inner">
                    <i className="fas fa-project-diagram fa-2x"></i>
                    <div className="stat-number">1000+</div>
                    <p className="stat-label">Uspešnih projekata</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card text-center">
                <div className="stat-circle mx-auto">
                  <div className="stat-circle-inner">
                    <i className="fas fa-trophy fa-2x"></i>
                    <div className="stat-number">50+</div>
                    <p className="stat-label">Nagrada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt sekcija */}
      <section id="kontakt" className="section-padding">
        <div className="container">
          <h2 className="text-center mb-5">Kontaktirajte Nas</h2>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <ContactForm />
            </div>
            <div className="col-lg-6">
              <div className="contact-info">
                <h3 className="mb-4">Informacije</h3>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Karadjordjeva 127
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-phone me-2"></i>
                    065 856 0207
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-envelope me-2"></i>
                    agencijasprint@gmail.com
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-clock me-2"></i>
                    Pon - Pet: 09:00 - 17:00
                  </li>
                </ul>
                <div className="social-links mt-4">
                  <a href="#" className="me-3"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="me-3"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="me-3"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" className="me-3"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-section {
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1');
          background-size: cover;
          height: 100vh;
          display: flex;
          align-items: center;
          color: white;
        }

        .service-card {
          transition: transform 0.3s;
        }

        .service-card:hover {
          transform: translateY(-10px);
        }

        .section-padding {
          padding: 100px 0;
        }

        .marketing-savet {
          position: relative;
          margin-bottom: 2rem;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast {
          transition: all 0.3s ease-in-out;
        }
        
        .form-control.is-invalid:focus,
        .form-control.is-valid:focus {
          box-shadow: none;
        }
        
        .service-card i {
          transition: all 0.3s ease-in-out;
        }
        
        .service-card h4 {
          transition: color 0.3s ease-in-out;
        }

        footer {
          position: relative;
          background: linear-gradient(45deg, #1a1a1a, #2c2c2c);
        }

        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, #0d6efd, #198754);
        }

        footer .social-links a {
          display: inline-block;
          width: 35px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transition: all 0.3s;
        }

        footer .social-links a:hover {
          background: #0d6efd;
          transform: translateY(-3px);
        }

        footer ul li a {
          transition: all 0.3s;
        }

        footer ul li a:hover {
          color: #0d6efd !important;
          padding-left: 5px;
        }

        footer hr {
          opacity: 0.1;
        }

        .stats-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: relative;
        }

        .stat-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(45deg, #0d6efd, #198754);
          padding: 4px;
          margin-bottom: 2rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .stat-circle:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(13, 110, 253, 0.2);
        }

        .stat-circle-inner {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .stat-circle i {
          color: #0d6efd;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
          text-align: center;
        }

        .contact-info {
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 15px;
          height: 100%;
        }

        .contact-info .social-links a {
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #0d6efd;
          color: white;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .contact-info .social-links a:hover {
          transform: translateY(-3px);
          background: #0043a8;
        }
      `}</style>
    </>
  );
} 