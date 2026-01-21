import Head from 'next/head';

export default function HomeDE() {
  return (
    <>
      <Head>
        <title>Sprint Marketing Agentur - Digitale Marketing Agentur in Hamburg</title>
        <meta name="description" content="Professionelle Digitale Marketing Agentur in Hamburg. SEO, Google Ads, Social Media Marketing und Webentwicklung. Steigern Sie Ihre Online-Präsenz mit unseren maßgeschneiderten Lösungen." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sprintmarketing.de/" />
        <meta property="og:title" content="Sprint Marketing Agentur - Ihre Digitale Marketing Agentur in Hamburg" />
        <meta property="og:description" content="Spezialisiert auf SEO, Google Ads, Social Media und Webentwicklung. Wir helfen Ihnen, Ihre Zielgruppe online zu erreichen und Ihren Umsatz zu steigern." />
        <meta property="og:image" content="https://sprintmarketing.de/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sprintmarketing.de/" />
        <meta property="twitter:title" content="Sprint Marketing Agentur - Digitale Marketing Experten" />
        <meta property="twitter:description" content="Ihre Full-Service Digitale Marketing Agentur in Hamburg. SEO, PPC, Social Media und mehr." />
        <meta property="twitter:image" content="https://sprintmarketing.de/images/twitter-image.jpg" />

        {/* Dodatni meta tagovi */}
        <meta name="keywords" content="Digital Marketing Hamburg, SEO Agentur, Google Ads, Social Media Marketing, Webentwicklung, Online Marketing, PPC Werbung" />
        <meta name="geo.region" content="DE-HH" />
        <meta name="geo.placename" content="Hamburg" />
        <link rel="alternate" hreflang="de" href="https://sprintmarketing.de/" />
        <link rel="alternate" hreflang="sr" href="https://sprintmarketing.de/sr/" />
        <link rel="canonical" href="https://sprintmarketing.de/" />
      </Head>

      {/* Ostatak komponente... */}
    </>
  );
} 